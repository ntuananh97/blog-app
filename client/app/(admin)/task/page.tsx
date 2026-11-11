import { TaskList } from "./task-list"



export default function TasksPage() {
  // Thay bằng user từ session (NextAuth, Clerk, ...)

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <TaskList />
      </main>
    </div>
  )
}