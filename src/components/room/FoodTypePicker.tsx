import { getFoodTypes } from '@/server/foodItem.function'
import { selectFoodType } from '@/server/room'
import { useQuery } from '@tanstack/react-query'
import React from 'react'


function FoodTypePicker({
  roomId,
  ownMemberId,
  selectedTypeId,
}: {
  roomId: string
  ownMemberId: string
  selectedTypeId: number | null
}) {
  const { data: types } = useQuery({
    queryKey: ["food-types"],
    queryFn: () => getFoodTypes(),
  })

  const handlePick = async (typeId: number) => {
    await selectFoodType({ data: { memberId: Number(ownMemberId), typeId } })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">เลือกประเภทอาหารที่อยากกิน</p>
      <div className="flex flex-wrap gap-2">
        {types?.map((type) => (
          <button
            key={type.id}
            onClick={() => handlePick(type.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedTypeId === type.id
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FoodTypePicker