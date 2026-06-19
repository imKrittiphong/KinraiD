export interface FoodType {
  typeId: number
  type: string
  lable: string
}

export interface FoodItem {
  id: number
  name: string
  type: FoodType
  price: number
}

// export interface logResult {
//     id: number
//     type: foodType[]
//     food: foodItem[]
//     result: number
// }