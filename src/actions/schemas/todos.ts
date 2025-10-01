import z from "zod"

export const todoFormSchema = z.object({
  title: z.string().min(1, "Todo name is required").trim(),
  public: z.boolean(),
})
