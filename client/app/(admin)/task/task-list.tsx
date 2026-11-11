"use client"

import { useEffect, useState } from "react"
import { Check, Plus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { httpRequest } from "@/lib/httpRequest"

// Nếu dùng Prisma: import { TaskStatus } from "@prisma/client"
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type Task = {
  id: string
  title: string
  status: TaskStatus
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pending",
  [TaskStatus.IN_PROGRESS]: "In progress",
  [TaskStatus.COMPLETED]: "Completed",
}

const STATUS_VARIANT: Record<
  TaskStatus,
  "secondary" | "default" | "outline"
> = {
  [TaskStatus.PENDING]: "secondary",
  [TaskStatus.IN_PROGRESS]: "default",
  [TaskStatus.COMPLETED]: "outline",
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await httpRequest.get<{task: Task[]}>("/tasks")
        setTasks(res.task)
      }
      catch (error) {
        console.error("Lỗi khi fetch tasks:", error)
      }
    }
    fetchTasks()
  }, [])

  function resetDraft() {
    setIsCreating(false)
    setTitle("")
    setStatus(TaskStatus.PENDING)
  }

  async function handleSave() {
    const trimmed = title.trim()
    if (!trimmed) return

    // TODO: gọi API tạo task (server action / fetch) rồi dùng dữ liệu trả về
    const newTask: Task = { id: crypto.randomUUID(), title: trimmed, status }
    setTasks((prev) => [newTask, ...prev])
    resetDraft()
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo task
        </Button>
      </div>

      <ul className="divide-y rounded-md border">
        {isCreating && (
          <li className="flex flex-col gap-2 bg-muted/40 p-3 sm:flex-row sm:items-center">
            <Input
              autoFocus
              placeholder="Tên task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") resetDraft()
              }}
              className="flex-1"
            />
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                size="icon"
                onClick={handleSave}
                disabled={!title.trim()}
                aria-label="Lưu task"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={resetDraft}
                aria-label="Hủy"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </li>
        )}

        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between gap-4 p-3"
          >
            <span className="truncate font-medium">{task.title}</span>
            <Badge variant={STATUS_VARIANT[task.status]}>
              {STATUS_LABEL[task.status]}
            </Badge>
          </li>
        ))}

        {tasks.length === 0 && !isCreating && (
          <li className="p-6 text-center text-sm text-muted-foreground">
            Chưa có task nào.
          </li>
        )}
      </ul>
    </section>
  )
}