import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/room/room/$roomId")({
  validateSearch: (search: Record<string, unknown>) => ({
    ownerName: String(search.ownerName ?? ""),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  
  const { roomId } = Route.useParams()
  const { ownerName } = Route.useSearch()
  const userMockData = [
  {
    name: ownerName,
    isOwner: true,
  },
  {
    name: "สมชาย",
    isOwner: false,
  },
  {
    name: "นัท",
    isOwner: false,
  },
]

  return (
    <div>
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          {/* Header */}
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
                👥 {userMockData.length} คน
              </span>
              <Button variant="outline" className="rounded-xl">
                แชร์ลิงก์
                <ArrowUpRight />
              </Button>
            </div>
          </div>

          {/* Users */}
          <div className="space-y-3">
            {userMockData.map((user) => (
              <div
                key={user.name}
                className="flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.isOwner ? "เจ้าของห้อง" : "ผู้ร่วมชะตากรรม"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6">
            <Button
              size="lg"
              className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg shadow-primary/20"
            >
              🎲 เริ่มสุ่มเมนู
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
