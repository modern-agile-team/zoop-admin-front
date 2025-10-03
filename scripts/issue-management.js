import { Octokit } from '@octokit/rest'

const githubContext = JSON.parse(process.env.GITHUB_CONTEXT)
const token = process.env.GITHUB_TOKEN
const eventName = process.env.GITHUB_EVENT_NAME
const eventAction = process.env.GITHUB_EVENT_ACTION

console.log(token)
console.log(eventName)
console.log(eventAction)

if (!token) {
  console.error('❌ GITHUB_TOKEN is missing.')
  process.exit(1)
}

const octokit = new Octokit({ auth: token })
const { owner, repo } = githubContext.repository

// PR 관련 이벤트 처리
async function handlePullRequest() {
  const pr = githubContext.event.pull_request
  const prBody = pr.body || ''
  const prNumber = pr.number
  const prTitle = pr.title
  const prAuthor = pr.user.login

  // PR 본문에서 이슈 번호 추출
  const issuePatterns = [
    /(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#(\d+)/gi,
    /(?:^|\s)#(\d+)(?:\s|$)/g,
    /이슈\s*#?(\d+)/gi,
    /issue\s*#?(\d+)/gi,
  ]

  let allIssueNumbers = new Set()

  for (const pattern of issuePatterns) {
    const matches = [...prBody.matchAll(pattern)]
    matches.forEach((match) => {
      const issueNumber = match[match.length - 1]
      if (issueNumber && !isNaN(issueNumber)) allIssueNumbers.add(issueNumber)
    })
  }

  const issues = Array.from(allIssueNumbers)
  if (issues.length === 0)
    return console.log('ℹ️ No linked issues found in PR body')

  if (eventAction === 'opened') {
    for (const issueNumber of issues) {
      try {
        await octokit.issues.addLabels({
          owner,
          repo,
          issue_number: issueNumber,
          labels: ['in-progress'],
        })
        await octokit.issues.addAssignees({
          owner,
          repo,
          issue_number: issueNumber,
          assignees: [prAuthor],
        })
        console.log(
          `✅ Added in-progress label and assigned ${prAuthor} to issue #${issueNumber}`,
        )
      } catch (err) {
        console.log(`❌ Failed to update issue #${issueNumber}: ${err.message}`)
      }
    }
  } else if (eventAction === 'closed' && pr.merged) {
    for (const issueNumber of issues) {
      try {
        await octokit.issues.update({
          owner,
          repo,
          issue_number: issueNumber,
          state: 'closed',
        })
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: `✅ PR #${prNumber} 머지로 인해 이 이슈가 자동으로 닫혔습니다.\n\n**PR 제목:** ${prTitle}`,
        })
        try {
          await octokit.issues.removeLabel({
            owner,
            repo,
            issue_number: issueNumber,
            name: 'in-progress',
          })
        } catch {}
        await octokit.issues.addLabels({
          owner,
          repo,
          issue_number: issueNumber,
          labels: ['completed'],
        })
        console.log(`✅ Closed issue #${issueNumber} and updated labels`)
      } catch (err) {
        console.log(`❌ Failed to close issue #${issueNumber}: ${err.message}`)
      }
    }
  } else if (eventAction === 'reopened') {
    for (const issueNumber of issues) {
      try {
        await octokit.issues.update({
          owner,
          repo,
          issue_number: issueNumber,
          state: 'open',
        })
        try {
          await octokit.issues.removeLabel({
            owner,
            repo,
            issue_number: issueNumber,
            name: 'completed',
          })
        } catch {}
        await octokit.issues.addLabels({
          owner,
          repo,
          issue_number: issueNumber,
          labels: ['in-progress'],
        })
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: `🔄 PR #${prNumber}이 다시 열려서 이 이슈가 재개되었습니다.`,
        })
        console.log(`✅ Reopened issue #${issueNumber}`)
      } catch (err) {
        console.log(`❌ Failed to reopen issue #${issueNumber}: ${err.message}`)
      }
    }
  }
}

// 브랜치 생성 이벤트 처리
async function handleBranchCreated() {
  const branchName = githubContext.event.ref
  const branchAuthor = githubContext.event.sender.login

  const issueMatches = branchName.match(/(\d+)/g)
  if (!issueMatches)
    return console.log(
      `ℹ️ No issue numbers found in branch name: ${branchName}`,
    )

  for (const issueNumber of issueMatches) {
    try {
      await octokit.issues.get({ owner, repo, issue_number: issueNumber }) // 존재 여부 확인
      await octokit.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: ['in-progress'],
      })
      await octokit.issues.addAssignees({
        owner,
        repo,
        issue_number: issueNumber,
        assignees: [branchAuthor],
      })
      console.log(
        `✅ Added in-progress label and assigned ${branchAuthor} to issue #${issueNumber} for branch ${branchName}`,
      )
    } catch (err) {
      if (err.status === 404) console.log(`⚠️ Issue #${issueNumber} not found`)
      else
        console.log(`❌ Failed to update issue #${issueNumber}: ${err.message}`)
    }
  }
}

// 이벤트 타입에 따라 함수 호출
;(async () => {
  try {
    if (eventName === 'pull_request') await handlePullRequest()
    else if (
      eventName === 'create' &&
      githubContext.event.ref_type === 'branch'
    )
      await handleBranchCreated()
    else
      console.log(
        `ℹ️ Event ${eventName} with action ${eventAction} is not handled`,
      )
  } catch (err) {
    console.error('❌ Error handling event:', err)
    process.exit(1)
  }
})()
