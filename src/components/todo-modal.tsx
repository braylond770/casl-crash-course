"use client"

import { ReactNode, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { todoFormSchema } from "@/actions/schemas/todos"
import z from "zod"
import { addTodoAction, editTodoAction } from "@/actions/todos"
import { LoadingSwap } from "./ui/loading-swap"

type TodoFormValues = z.infer<typeof todoFormSchema>

interface TodoModalProps {
  todo?: {
    id: string
    title: string
    public: boolean
  }
  trigger: ReactNode
}

export function TodoModal({ todo, trigger }: TodoModalProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: todo ?? { title: "", public: false },
  })

  async function handleSubmit(values: TodoFormValues) {
    const action =
      todo == null ? addTodoAction : editTodoAction.bind(null, todo.id)
    const result = await action(values)
    if (result.error) {
      toast.error(result.message)
    } else {
      form.reset(result.todo)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>
            {todo == null ? "Add New Todo" : "Edit Todo"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Todo Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Public</FormLabel>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  {todo == null ? "Add Todo" : "Save Changes"}
                </LoadingSwap>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
