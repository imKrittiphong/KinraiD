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

export interface Room {
  id: string
  code: string
  ownerName: string
  members: Member[]
}

export interface Member {
  id: string
  name: string
  isOwner: boolean
}

// export interface logResult {
//     id: number
//     type: foodType[]
//     food: foodItem[]
//     result: number
// }