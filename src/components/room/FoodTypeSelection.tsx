import { getFoodTypes } from "@/server/foodItem.function"
import {
  getRoomMembers,
  selectFoodType,
  randomizeRoom,
  startRandomizing,
  exsitRoom,
} from "@/server/room"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { Angry, ArrowLeft, CheckCircle2, DoorOpen } from "lucide-react"
import { Link, redirect } from "@tanstack/react-router"

function FoodTypeSelection({
  roomId,
  ownMemberId,
  isHost,
}: {
  roomId: string
  ownMemberId: string
  isHost: boolean
}) {
  const { data: types } = useQuery({
    queryKey: ["food-types"],
    queryFn: () => getFoodTypes(),
  })

  const { data } = useQuery({
    queryKey: ["room", roomId, "members"],
    queryFn: () => getRoomMembers({ data: { roomId } }),
    refetchInterval: 2000,
  })

  const members = data?.members ?? []

  const me = members.find((m) => String(m.id) === ownMemberId)
  const token = sessionStorage.getItem(`room:${roomId}:token`) ?? ""

  const handlePick = async (typeId: number | "any") => {
    await selectFoodType({ data: { memberId: Number(ownMemberId), typeId } })
  }

  const handleExsit = async () => {
    try {
      await exsitRoom({ data: { roomId, token } })
      sessionStorage.removeItem(`room:${roomId}:memberId`)
      sessionStorage.removeItem(`room:${roomId}:token`)
    } catch (err: any) {}
  }

  const handleRandomize = async () => {
    try {
      await startRandomizing({ data: { roomId, token } }) // ทุกคนเด้งไปหน้าโหลดทันที
      await new Promise((r) => setTimeout(r, 2500)) // ดีเลย์ให้ดูมี suspense
      await randomizeRoom({ data: { roomId, token } }) // ค่อยสุ่มผลจริง
    } catch (err) {
      alert(err instanceof Error ? err.message : "สุ่มไม่สำเร็จ")
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex justify-between">
          <h3 className="text-2xl font-bold">เลือกประเภทอาหารที่อยากกิน</h3>
          <Link to="/room">
          <Button size="lg" className="text-lg" onClick={() => handleExsit()}>
            <DoorOpen />
            บิด
          </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          เปลี่ยนใจได้ตลอด จนกว่าเจ้าของห้องจะกดสุ่ม
        </p>
        <span className="text-sm text-muted-foreground">
          เลือกแล้วรอซักครู่...
        </span>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-7">
          {types?.map((type) => (
            <Button
              key={type.id}
              onClick={() => handlePick(type.id)}
              className={`text-md h-16 rounded-xl border px-4 py-2 font-bold transition-colors ${
                me?.selectedTypeId === type.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-2 border-amber-300 bg-white"
              }`}
            >
              {type.label}
            </Button>
          ))}
        </div>

        <div className="mt-8 space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <span className="font-medium">{m.nickname}</span>
              <span className="text-sm text-muted-foreground">
                {m.selectedTypeId ? (
                  <div className="flex items-center space-x-2">
                    <p>เลือกแล้ว</p>
                    <CheckCircle2 color="green" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <p>ยังไม่ได้เลือก</p>
                    <Angry color="red" />
                  </div>
                )}
              </span>
            </div>
          ))}
        </div>

        {isHost && (
          <Button
            size="lg"
            className="mt-6 h-16 w-full rounded-2xl text-xl font-bold shadow-lg shadow-primary/20"
            disabled={!me?.selectedTypeId}
            onClick={handleRandomize}
          >
            🎲 สุ่มเลย
          </Button>
        )}
      </div>
    </main>
  )
}

export default FoodTypeSelection
