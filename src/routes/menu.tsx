import { createFileRoute, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Utensils, Soup, Flame, Pizza, Coffee, Store, ArrowLeft, Search } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/menu")({
  component: MenuPage,
})

const categories = [
  { id: "all", label: "ทั้งหมด", icon: <Store size={18} /> },
  { id: "order", label: "ตามสั่ง", icon: <Utensils size={18} /> },
  { id: "noodle", label: "ก๋วยเตี๋ยว", icon: <Soup size={18} /> },
  { id: "somtum", label: "ส้มตำ/อีสาน", icon: <Flame size={18} /> },
  { id: "fastfood", label: "ฟาสต์ฟู้ด", icon: <Pizza size={18} /> },
  { id: "cafe", label: "คาเฟ่/ของหวาน", icon: <Coffee size={18} /> },
]

const foodItems = [
  { id: 1, name: "ข้าวกะเพราหมูกรอบ", category: "order", price: "60.-", rating: 4.8 },
  { id: 2, name: "เส้นเล็กต้มยำน้ำข้น", category: "noodle", price: "55.-", rating: 4.5 },
  { id: 3, name: "ส้มตำปูปลาร้า", category: "somtum", price: "50.-", rating: 4.9 },
  { id: 4, name: "ไก่ทอดหาดใหญ่", category: "somtum", price: "80.-", rating: 4.7 },
  { id: 5, name: "ข้าวผัดปู", category: "order", price: "70.-", rating: 4.6 },
  { id: 6, name: "บะหมี่หมูแดง", category: "noodle", price: "50.-", rating: 4.4 },
  { id: 7, name: "เบอร์เกอร์เนื้อนุ่ม", category: "fastfood", price: "120.-", rating: 4.8 },
  { id: 8, name: "บิงซูสตรอว์เบอร์รี่", category: "cafe", price: "180.-", rating: 4.9 },
]

function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-svh bg-linear-to-b from-background to-muted/20 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            เลือกเมนูอาหาร
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Search Bar */}
        <div className="relative animate-in fade-in slide-in-from-top-4 duration-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาเมนูที่ต้องการ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-card border-2 border-border/50 focus:border-primary/50 outline-hidden transition-all text-lg font-medium"
          />
        </div>

        {/* Categories Scrolling List */}
        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 fill-mode-both">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">หมวดหมู่</h2>
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 whitespace-nowrap hover:scale-105 active:scale-95 ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                    : "bg-card text-muted-foreground border-border/50 hover:border-primary/30"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div 
          key={selectedCategory + searchQuery}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500"
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group p-5 rounded-3xl bg-card border-2 border-border/50 shadow-sm transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 hover:scale-102 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                  {categories.find(c => c.id === item.category)?.label}
                </span>
                <span className="text-xl font-black text-primary">{item.price}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="text-yellow-500">★</span>
                <span className="font-bold text-foreground">{item.rating}</span>
                <span className="mx-1">•</span>
                <span>แนะนำโดยร้านค้า</span>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="inline-flex p-6 rounded-full bg-muted/50 text-muted-foreground">
                <Search size={48} />
              </div>
              <p className="text-xl font-bold text-muted-foreground">ไม่พบเมนูที่คุณค้นหา</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Randomizing */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in duration-500 delay-500 fill-mode-both">
        <Link to="/solo">
          <Button size="lg" className="h-16 px-10 rounded-full text-xl font-black shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all">
            <Flame className="mr-2 animate-pulse" />
            สุ่มเลย!
          </Button>
        </Link>
      </div>
    </div>
  )
}


