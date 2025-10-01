"use client"

import { useTransition } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { toggleTodoAction } from "@/actions/todos"

interface TodoCheckboxProps {
  id: string
  checked: boolean
}

export function TodoCheckbox({ id, checked }: TodoCheckboxProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle(newChecked: boolean) {
    startTransition(async () => {
      const result = await toggleTodoAction(id, newChecked)
      if (result.error) toast.error(result.message)
    })
  }

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={newChecked => handleToggle(newChecked === true)}
      disabled={isPending}
      className="size-5"
    />
  )
}
