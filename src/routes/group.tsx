import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/group")({
  component: RouteComponent,
})

function RouteComponent() {
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
        <div className="animate-in bg-card p-8  duration-500 fade-in slide-in-from-top-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 text-6xl">🍽️</div>

            <h2 className="text-3xl font-bold">ชวนเพื่อนมาดูเมนูวันนี้</h2>

            <p className="mt-3 max-w-md text-muted-foreground">
              พอกันกับอะไรก็ได้ ส่งลิงก์นี้ให้เพื่อนแล้วมาร่วมชะตากรรมไปพร้อมกัน
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                size="lg"
                className="h-16 w-full rounded-3xl border-2 px-10 text-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                คัดลอกลิงก์
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-16 w-full rounded-3xl border-2 px-10 text-xl font-semibold transition-all hover:scale-105 hover:bg-muted/50 active:scale-95"
              >
                แชร์ทันที
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
