// route: /room/room/$roomId
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getRoomMembers, joinRoom } from "@/server/room"

export const Route = createFileRoute("/room/room/$roomId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { roomId } = Route.useParams()
  const [ownMemberId, setOwnMemberId] = useState(() =>
    sessionStorage.getItem(`room:${roomId}:memberId`)
  )

  // ยังไม่ join ห้องนี้ -> โชว์ฟอร์มกรอกชื่อก่อน
  if (!ownMemberId) {
    return <JoinForm roomId={roomId} onJoined={setOwnMemberId} />
  }

  return <RoomLobby roomId={roomId} ownMemberId={ownMemberId} />
}

function JoinForm({
  roomId,
  onJoined,
}: {
  roomId: string
  onJoined: (memberId: string) => void
}) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { member } = await joinRoom({ data: { roomId, nickname: name } })
      sessionStorage.setItem(`room:${roomId}:memberId`, String(member.id))
      onJoined(String(member.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าร่วมห้องไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-linear-to-b from-background to-muted/20 pb-20">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <h1 className="bg-linear-to-r from-primary to-red-400 bg-clip-text text-2xl font-black text-transparent">
            ร่วมชะตากรรม
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        <div className="animate-in rounded-3xl border bg-card p-8 shadow-sm duration-500 fade-in slide-in-from-top-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-6xl">🎲</div>
            <h2 className="text-3xl font-bold">มีคนชวนมาสุ่มเมนู</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              ใส่ชื่อของคุณแล้วกดเข้าร่วม จะได้เห็นว่ามีใครอยู่ในห้องบ้าง
            </p>

            <div className="mt-8 w-full max-w-md space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium">ชื่อของคุณ</label>
                <Input
                  placeholder="เช่น สมหญิง"
                  className="h-12 rounded-xl"
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name && handleJoin()}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                size="lg"
                className="h-14 w-full rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20"
                disabled={!name || loading}
                onClick={handleJoin}
              >
                {loading ? "กำลังเข้าร่วม..." : "เข้าร่วม"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function RoomLobby({
  roomId,
  ownMemberId,
}: {
  roomId: string
  ownMemberId: string
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["room", roomId, "members"],
    queryFn: () => getRoomMembers({ data: { roomId } }),
    refetchInterval: 2000,
  })

  if (isLoading) {
    return <p className="p-6 text-center text-muted-foreground">กำลังโหลด...</p>
  }

  const members = data?.members ?? []
  const isHost =
    members.find((m) => String(m.id) === ownMemberId)?.isHost ?? false

  return (
    <div>
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <Link to="/room">
                <Button variant="outline" size="icon" className="rounded-xl">
                  <ArrowLeft />
                </Button>
              </Link>
              <div>
                <h3 className="text-2xl font-bold">ผู้ร่วมชะตากรรม</h3>
                <p className="text-sm text-muted-foreground">ห้อง #{roomId}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium">
                👥 {members.length} คน
              </span>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={members.length === 10}
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/room/room/${roomId}`
                  )
                }
              >
                แชร์ลิงก์
                <ArrowUpRight />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-bold">
                  {member.nickname.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{member.nickname}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.isHost ? "เจ้าของห้อง" : "ผู้ร่วมชะตากรรม"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              size="lg"
              className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg shadow-primary/20"
              disabled={!isHost}
            >
              🎲 เริ่มสุ่มเมนู
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
