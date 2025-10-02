import Header from '@/shared/components/Header'

export default function HomePage() {
  return (
    <>
      {/* 헤더 영역 */}
      <Header />

      {/* 본문 영역 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to the Quiz Game Admin</h1>
      </div>
    </>
  )
}
