import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Utensils } from "lucide-react"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-linear-to-b from-background to-muted/20 p-6 overflow-hidden">
      <div className="flex max-w-md w-full flex-col items-center gap-10 text-center animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center gap-6">
          <div className="relative hover:scale-105 transition-transform duration-300">
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-2xl animate-pulse" />
            <div className="relative rounded-full bg-primary/10 p-6 text-primary shadow-2xl shadow-primary/20 animate-bounce">
              <Utensils size={56} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/80 to-primary/60">
              วันนี้ กินไรดี?
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-[320px] mx-auto">
              เบื่อมั้ยกับการคิดว่าจะกินอะไร? ให้เราช่วยตัดสินใจมื้อพิเศษของคุณสิ!
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <Link to="/solo" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-16 w-full text-xl font-bold px-10 rounded-3xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
            >
              สุ่มเลย!
            </Button>
          </Link>
          
          <Link to="/menu" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-full text-xl font-semibold px-10 rounded-3xl border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
            >
              เลือกทางของคุณ
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 w-full pt-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 fill-mode-both">
          <div className="group p-8 rounded-4xl bg-card border-2 border-border/50 shadow-sm transition-all hover:border-primary/30 hover:-translate-y-2 hover:scale-102">
            <p className="text-4xl font-black text-primary mb-1">100+</p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              เมนูยอดฮิต: กินอะไรก็ได้
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

