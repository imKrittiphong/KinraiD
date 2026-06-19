import { createServerOnlyFn } from "@tanstack/react-start"
import { prisma } from "@/lib/prisma"

export const fetchFoodItems = createServerOnlyFn(() =>
  prisma.foodItem.findMany({ include: { type: true } })
)

export const fetchFoodTypes = createServerOnlyFn(() =>
  prisma.foodType.findMany()
)