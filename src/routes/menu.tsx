import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Utensils,
  Soup,
  Flame,
  Pizza,
  Coffee,
  Store,
  ArrowLeft,
  Search,
  Hamburger,
  ChevronLeft,
  ChevronRight,
  Dessert,
  CakeSlice,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { getFoodItems, getFoodTypes } from "@/server/foodItem.function"

export const Route = createFileRoute("/menu")({
  loader: async () => {
    const [food, foodTypes] = await Promise.all([
      getFoodItems(),
      getFoodTypes(),
    ])
    return { food, foodTypes }
  },
  component: MenuPage,
})

const categoryIcons: Record<string, React.ReactNode> = {
  rice: <Utensils size={16} />,
  fastfood: <Hamburger size={16} />,
  esan: <Flame size={16} />,
  noodle: <Soup size={16} />,
  japanese: <Pizza size={16} />,
  korean: <Coffee size={16} />,
  dessert: <CakeSlice size={16} />,
}

function MenuPage() {
  const { food, foodTypes } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const categories = [
    { type: "all", label: "ทั้งหมด", icon: <Store size={16} /> },
    ...foodTypes.map((t) => ({
      type: t.type,
      label: t.label,
      icon: categoryIcons[t.type] ?? <Store size={16} />,
    })),
  ]

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      checkScroll()
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll)
      }
      window.removeEventListener("resize", checkScroll)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const filteredItems = food.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.type.type === selectedCategory
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-svh bg-linear-to-b from-background to-muted/20 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <h1 className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-2xl font-black text-transparent">
            เลือกเมนูอาหาร
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 p-6">
        {/* Search Bar */}
        <div className="relative animate-in duration-500 fade-in slide-in-from-top-4">
          <Search
            className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="ค้นหาเมนูที่ต้องการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border-2 border-border/50 bg-card pr-6 pl-12 text-lg font-medium outline-hidden transition-all focus:border-primary/50"
          />
        </div>

        {/* Categories Scrolling List */}
        <div className="animate-in space-y-4 delay-150 duration-500 fill-mode-both fade-in slide-in-from-left-4">
          <h2 className="px-1 text-sm font-bold tracking-widest text-muted-foreground uppercase">
            หมวดหมู่
          </h2>
          <div className="group/scroll relative px-1">
            {showLeftArrow && (
              <button
                onClick={() => scroll("left")}
                className="absolute bottom-1 -left-8 z-10 -translate-x-2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur-md transition-all group-hover/scroll:opacity-100 hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth pb-4"
            >
              {categories.map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => setSelectedCategory(cat.type)}
                  className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-all hover:scale-105 active:scale-95 ${
                    selectedCategory === cat.type
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "border-border/50 bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-8 bottom-1 z-10 translate-x-2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur-md transition-all group-hover/scroll:opacity-100 hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        <div
          key={selectedCategory + searchQuery}
          className="grid animate-in grid-cols-1 gap-4 duration-500 fade-in sm:grid-cols-2"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group animate-in rounded-3xl border-2 border-border/50 bg-card p-5 shadow-sm transition-all duration-500 fill-mode-both fade-in slide-in-from-bottom-4 hover:-translate-y-1 hover:scale-102 hover:border-primary/30 hover:shadow-xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black tracking-wider text-primary uppercase">
                  {item.type.label}
                </span>
                <span className="text-xl font-black text-primary">
                  {item.price} ฿
                </span>
              </div>
              <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
                {item.name}
              </h3>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full space-y-4 py-20 text-center">
              <div className="inline-flex rounded-full bg-muted/50 p-6 text-muted-foreground">
                <Search size={48} />
              </div>
              <p className="text-xl font-bold text-muted-foreground">
                ไม่พบเมนูที่คุณค้นหา
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Randomizing */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-in delay-500 duration-500 fill-mode-both fade-in zoom-in">
        <Link to="/solo">
          <Button
            size="lg"
            className="h-16 rounded-full px-10 text-xl font-black shadow-2xl shadow-primary/40 transition-all hover:scale-110 active:scale-95"
          >
            <Flame className="mr-2 animate-pulse" />
            สุ่มเลย!
          </Button>
        </Link>
      </div>
    </div>
  )
}