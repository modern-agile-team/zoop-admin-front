#!/usr/bin/env node

import { Octokit } from '@octokit/rest'

const githubContext = JSON.parse(process.env.GITHUB_CONTEXT)
const token = process.env.GITHUB_TOKEN

if (!token) {
  console.error('❌ GITHUB_TOKEN is missing.')
  process.exit(1)
}

const octokit = new Octokit({ auth: token })

const { owner, repo } = githubContext.repository
const pr = githubContext.event.pull_request
const prNumber = pr.number
const prBody = pr.body || ''
const headBranch = pr.head.ref

console.log(`🚀 Running PR Auto Issue Fill for PR #${prNumber}`)

// 1️⃣ 이미 이슈 섹션이 채워져 있으면 스킵
const hasIssueAlready =
  /(?:### 연관된 이슈|## 🔗 연관된 이슈)\s*\n\n(?!<!--)/.test(prBody)
if (hasIssueAlready) {
  console.log('ℹ️ PR template already has issue numbers filled. Skipping.')
  process.exit(0)
}

// 2️⃣ 브랜치명에서 이슈 번호 추출
const branchIssuePatterns = [
  /feature-(\d+)/gi,
  /feature\/(\d+)/gi,
  /bugfix-(\d+)/gi,
  /bugfix\/(\d+)/gi,
  /hotfix-(\d+)/gi,
  /hotfix\/(\d+)/gi,
  /(\d+)/g,
]

const branchIssueNumbers = new Set()
branchIssuePatterns.forEach((pattern) => {
  const matches = [...headBranch.matchAll(pattern)]
  matches.forEach((m) => m[1] && branchIssueNumbers.add(m[1]))
})

// 3️⃣ 커밋 메시지에서 이슈 번호 추출
const { data: commits } = await octokit.pulls.listCommits({
  owner,
  repo,
  pull_number: prNumber,
})

const commitIssueNumbers = new Set()
const issuePatterns = [
  /#(\d+)/g,
  /이슈\s*#?(\d+)/gi,
  /issue\s*#?(\d+)/gi,
  /(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#(\d+)/gi,
]

commits.forEach((commit) => {
  const message = commit.commit.message
  issuePatterns.forEach((pattern) => {
    const matches = [...message.matchAll(pattern)]
    matches.forEach((match) => {
      const issueNumber = match[match.length - 1]
      if (issueNumber && !isNaN(issueNumber)) {
        commitIssueNumbers.add(issueNumber)
      }
    })
  })
})

// 4️⃣ 이슈 유효성 검사
const allIssueNumbers = new Set([...branchIssueNumbers, ...commitIssueNumbers])
const validIssues = []

for (const num of allIssueNumbers) {
  try {
    await octokit.issues.get({ owner, repo, issue_number: num })
    validIssues.push(num)
  } catch (e) {
    if (e.status === 404) {
      console.log(`⚠️ Issue #${num} not found, skipping`)
    }
  }
}

if (validIssues.length === 0) {
  console.log('ℹ️ No valid issues found. Exiting.')
  process.exit(0)
}

// 5️⃣ PR 템플릿의 연관 이슈 섹션 교체
const issueLinks = validIssues.map((num) => `Closes #${num}`).join(', ')
const patterns = [
  /(### 연관된 이슈\s*\n+)<!-- 이슈 번호를 입력해주세요[\.\s]*예: Closes #123, Fixes #456, Resolves #789 -->[\s\S]*?(?=\n##|\n###|$)/,
  /(## 🔗 연관된 이슈\s*\n+)<!-- 이슈 번호를 입력해주세요[\.\s]*예: Closes #123, Fixes #456, Resolves #789 -->[\s\S]*?(?=\n##|\n###|$)/,
]

let updatedBody = prBody
let updated = false

for (const pattern of patterns) {
  const newBody = updatedBody.replace(pattern, `$1${issueLinks}\n`)
  if (newBody !== updatedBody) {
    updatedBody = newBody
    updated = true
    break
  }
}

if (!updated) {
  console.log('⚠️ Failed to find issue section in PR template. Exiting.')
  process.exit(0)
}

// 6️⃣ PR 본문 업데이트
await octokit.pulls.update({
  owner,
  repo,
  pull_number: prNumber,
  body: updatedBody,
})

console.log(`✅ Updated PR #${prNumber} with issues: ${issueLinks}`)

// 7️⃣ 코멘트 남기기
await octokit.issues.createComment({
  owner,
  repo,
  issue_number: prNumber,
  body:
    `🤖 **자동 감지된 연관 이슈들이 PR 템플릿에 추가되었습니다**\n\n` +
    `**감지된 이슈:** ${validIssues.map((n) => `#${n}`).join(', ')}\n\n` +
    `**브랜치명:** \`${headBranch}\`\n\n` +
    `브랜치명과 커밋 메시지를 분석하여 자동으로 연결했습니다. 필요 시 직접 수정해주세요.`,
})
