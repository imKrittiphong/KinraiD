import { createServerFn } from "@tanstack/react-start"
import { fetchFoodItems, fetchFoodTypes } from "./foodItem.server"

export const getFoodItems = createServerFn({ method: "GET" }).handler(() =>
  fetchFoodItems()
)

export const getFoodTypes = createServerFn({ method: "GET" }).handler(() =>
  fetchFoodTypes()
)