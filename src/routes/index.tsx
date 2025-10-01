import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Welcome to the Quiz Game</h1>
    </div>
  )
}
