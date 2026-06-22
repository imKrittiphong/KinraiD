import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Utensils } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center overflow-hidden bg-linear-to-b from-background to-muted/20 p-6">
      <div className="flex w-full max-w-md animate-in flex-col items-center gap-10 text-center duration-700 fade-in zoom-in">
        <div className="flex flex-col items-center gap-6">
          <div className="relative transition-transform duration-300 hover:scale-105">
            <div className="absolute -inset-6 animate-pulse rounded-full bg-primary/20 blur-2xl" />
            <div className="relative animate-bounce rounded-full bg-primary/10 p-6 text-primary shadow-2xl shadow-primary/20">
              <Utensils size={56} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
              วันนี้ กินไรดี?
            </h1>
            <p className="mx-auto max-w-[320px] text-xl leading-relaxed text-muted-foreground">
              เบื่อมั้ยกับการคิดว่าจะกินอะไร?
              ให้เราช่วยตัดสินใจมื้อพิเศษของคุณสิ!
            </p>
          </div>
        </div>

        <div className="w-full animate-in flex-col gap-4 delay-300 duration-700 fill-mode-both fade-in slide-in-from-bottom-8 sm:flex-row sm:justify-center">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Link to="/solo" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-16 w-full rounded-3xl px-10 text-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 active:scale-95"
                >
                  สุ่มเลย!
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/menu" className="w-full sm:w-60">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 w-full rounded-3xl border-2 text-xl font-semibold transition-all hover:scale-105 hover:bg-muted/50 active:scale-95"
                >
                  เลือกเมนูของคุณ
                </Button>
              </Link>
            </div>
          </div>
          <div className="my-4 text-lg">
            <p>หรือ</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Link to="/group">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 w-full rounded-3xl border-2 px-10 text-xl font-semibold transition-all hover:scale-105 hover:bg-muted/50 active:scale-95"
                >
                  เลือกกับเพื่อน
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/">
                <Button
                  size="lg"
                  variant="default"
                  className="h-16 w-full bg-secondary-foreground/90 hover:bg-secondary-foreground/50 text-white  rounded-3xl border-2 px-10 text-xl font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  ถ่ายเมนู
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid w-full animate-in gap-4 delay-500 duration-700 fill-mode-both fade-in slide-in-from-bottom-12">
          <div className="group rounded-4xl border-2 border-border/50 bg-card p-8 shadow-sm transition-all hover:-translate-y-2 hover:scale-102 hover:border-primary/30">
            <p className="mb-1 text-4xl font-black text-primary">100+</p>
            <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
              เมนูยอดฮิต: กินอะไรก็ได้
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
