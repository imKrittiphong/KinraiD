// route: /room/
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { createRoom } from "@/server/room"

export const Route = createFileRoute("/room/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCreateRoom = async () => {
    setLoading(true)
    try {
      const { roomId, token, member } = await createRoom({ data: { ownerName: name } })
      sessionStorage.setItem(`room:${roomId}:token`, token)
      sessionStorage.setItem(`room:${roomId}:memberId`, String(member.id))
      navigate({ to: "/room/room/$roomId", params: { roomId }, search:{name} })
    } catch (err) {
      alert(err instanceof Error ? err.message : "สร้างห้องไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh animate-accordion-up bg-linear-to-b from-background to-muted/20 pb-20">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <h1 className="bg-linear-to-r from-primary to-red-400 bg-clip-text text-2xl font-black text-transparent">
            หาเพื่อนร่วมชะตากรรม
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        <div className="animate-in rounded-3xl border bg-card p-8 shadow-sm duration-500 fade-in slide-in-from-top-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-6xl">🍽️</div>
            <h2 className="text-3xl font-bold">ชวนเพื่อนมาดูเมนูวันนี้</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              พอกันกับอะไรก็ได้ ส่งลิงก์นี้ให้เพื่อนแล้วมาร่วมชะตากรรมไปพร้อมกัน
            </p>

            <div className="mt-8 w-full max-w-md space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium">ชื่อของคุณ</label>
                <Input
                  placeholder="เช่น สมชาย"
                  className="h-12 rounded-xl"
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20"
                disabled={!name || loading}
                onClick={handleCreateRoom}
              >
                {loading ? "กำลังสร้างห้อง..." : "เริ่มสร้างห้อง"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}