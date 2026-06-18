import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  RefreshCw,
  UtensilsCrossed,
  Wallet,
  CheckCircle2,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

export const Route = createFileRoute("/solo")({
  component: SoloModePage,
})

const budgetOptions = [
  { id: "under50", label: "< 50", value: [0, 50] },
  { id: "50-100", label: "50-100", value: [50, 100] },
  { id: "100-200", label: "100-200", value: [100, 200] },
  { id: "unlimited", label: "ไม่จำกัด", value: [0, 9999] },
]

const foodTypes = [
  { id: "rice", label: "ข้าว" },
  { id: "noodle", label: "ก๋วยเตี๋ยว" },
  { id: "japanese", label: "ญี่ปุ่น" },
  { id: "korean", label: "เกาหลี" },
  { id: "dessert", label: "ของหวาน" },
  { id: "any", label: "อะไรก็ได้" },
]

const mockDatabase = [
  // ข้าว
  { name: "กะเพราไก่ไข่ดาว", type: "rice", price: 70 },
  { name: "กะเพราหมูกรอบ", type: "rice", price: 80 },
  { name: "ข้าวมันไก่", type: "rice", price: 50 },
  { name: "ข้าวขาหมู", type: "rice", price: 60 },
  { name: "ข้าวหมูแดง", type: "rice", price: 60 },
  { name: "ข้าวหมูกรอบ", type: "rice", price: 70 },
  { name: "ข้าวผัดหมู", type: "rice", price: 65 },
  { name: "ข้าวผัดทะเล", type: "rice", price: 80 },
  { name: "ข้าวคลุกกะปิ", type: "rice", price: 75 },
  { name: "ข้าวหน้าเป็ด", type: "rice", price: 90 },
  { name: "ข้าวต้มปลา", type: "rice", price: 80 },
  { name: "ข้าวไข่เจียวหมูสับ", type: "rice", price: 50 },
  { name: "ข้าวแกงเขียวหวานไก่", type: "rice", price: 70 },
  { name: "ข้าวคั่วกลิ้งหมู", type: "rice", price: 75 },
  { name: "ข้าวหมูทอดกระเทียม", type: "rice", price: 70 },
  { name: "ข้าวไก่ทอด", type: "rice", price: 65 },

  // ก๋วยเตี๋ยว
  { name: "ก๋วยเตี๋ยวเรือ", type: "noodle", price: 50 },
  { name: "ก๋วยเตี๋ยวต้มยำ", type: "noodle", price: 60 },
  { name: "บะหมี่หมูแดง", type: "noodle", price: 55 },
  { name: "บะหมี่เกี๊ยว", type: "noodle", price: 60 },
  { name: "เย็นตาโฟ", type: "noodle", price: 60 },
  { name: "ราดหน้า", type: "noodle", price: 70 },
  { name: "ผัดซีอิ๊ว", type: "noodle", price: 70 },
  { name: "สุกี้น้ำ", type: "noodle", price: 70 },
  { name: "สุกี้แห้ง", type: "noodle", price: 70 },
  { name: "ก๋วยจั๊บน้ำข้น", type: "noodle", price: 75 },
  { name: "ผัดไทยกุ้งสด", type: "noodle", price: 80 },
  { name: "หมี่กระเฉดกุ้ง", type: "noodle", price: 85 },
  { name: "บะหมี่ต้มยำ", type: "noodle", price: 55 },
  { name: "วุ้นเส้นผัดไทย", type: "noodle", price: 75 },

  // ญี่ปุ่น
  { name: "ราเมงทงคัตสึ", type: "japanese", price: 180 },
  { name: "โชยุราเมง", type: "japanese", price: 170 },
  { name: "ข้าวหน้าหมู Gyudon", type: "japanese", price: 150 },
  { name: "ข้าวแกงกะหรี่ญี่ปุ่น", type: "japanese", price: 160 },
  { name: "ข้าวหน้าปลาแซลมอน", type: "japanese", price: 250 },
  { name: "ซูชิรวม", type: "japanese", price: 250 },
  { name: "ซูชิสายพาน", type: "japanese", price: 300 },
  { name: "คัตสึด้ง", type: "japanese", price: 180 },
  { name: "อุด้งหมู", type: "japanese", price: 170 },
  { name: "โซบะเย็น", type: "japanese", price: 190 },

  // เกาหลี
  { name: "ข้าวหมูย่างเกาหลี", type: "korean", price: 150 },
  { name: "บิบิมบับ", type: "korean", price: 180 },
  { name: "จาจังมยอน", type: "korean", price: 160 },
  { name: "จัมปง", type: "korean", price: 180 },
  { name: "คิมบับ", type: "korean", price: 120 },
  { name: "ต๊อกบกกี", type: "korean", price: 130 },
  { name: "ไก่ทอดเกาหลี", type: "korean", price: 180 },
  { name: "บูลโกกิ", type: "korean", price: 220 },
  { name: "ซุปกิมจิ", type: "korean", price: 160 },
  { name: "หมูผัดซอสเกาหลี", type: "korean", price: 170 },

  // ของหวาน
  { name: "ขนมครก", type: "dessert", price: 30 },
  { name: "บิงซูเมล่อน", type: "dessert", price: 199 },
  { name: "บิงซูสตรอว์เบอร์รี่", type: "dessert", price: 219 },
  { name: "ไอศกรีมกะทิ", type: "dessert", price: 40 },
  { name: "เฉาก๊วยนมสด", type: "dessert", price: 45 },
  { name: "ลอดช่อง", type: "dessert", price: 35 },
  { name: "บัวลอย", type: "dessert", price: 40 },
  { name: "ข้าวเหนียวมะม่วง", type: "dessert", price: 120 },
  { name: "แพนเค้ก", type: "dessert", price: 150 },
  { name: "ฮันนี่โทสต์", type: "dessert", price: 180 },
]

function SoloModePage() {
  const [step, setStep] = useState(1)
  const [budget, setBudget] = useState("unlimited")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isExclusionMode, setIsExclusionMode] = useState(false)
  const [result, setResult] = useState<{ name: string; price: number } | null>(
    null
  )

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const toggleType = (id: string) => {
    if (id === "any") {
      setSelectedTypes(["any"])
      setIsExclusionMode(false)
      return
    }

    let newTypes = selectedTypes.filter((t) => t !== "any")

    if (newTypes.includes(id)) {
      newTypes = newTypes.filter((t) => t !== id)
    } else {
      newTypes = [...newTypes, id]
    }
    setSelectedTypes(newTypes)
  }

  const toggleExclusionMode = () => {
    setIsExclusionMode(!isExclusionMode)
    setSelectedTypes([])
  }

  const handleRandom = () => {
    const selectedBudget = budgetOptions.find((b) => b.id === budget)
      ?.value || [0, 9999]
    let filtered = mockDatabase.filter(
      (item) =>
        item.price >= selectedBudget[0] && item.price <= selectedBudget[1]
    )

    if (selectedTypes.includes("any")) {
      // No additional type filtering needed
    } else if (isExclusionMode) {
      if (selectedTypes.length > 0) {
        filtered = filtered.filter((item) => !selectedTypes.includes(item.type))
      }
    } else if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) => selectedTypes.includes(item.type))
    }

    if (filtered.length > 0) {
      const randomItem = filtered[Math.floor(Math.random() * filtered.length)]
      setResult(randomItem)
    } else if (isExclusionMode) {
      if (filtered.length  === 0) {
        setResult({ name: "ไม่ต้องกิน เลือกอย่างใดอย่างนึง", price: 0 })
      }
    } else {
      setResult({ name: "ไม่พบเมนูที่ตรงตามเงื่อนไข ลองสุ่มใหม่นะ!", price: 0 })
    }
    setStep(4)
    console.log(filtered)
    console.log(isExclusionMode, filtered.length)
  }

  const reset = () => {
    setStep(1)
    setBudget("unlimited")
    setSelectedTypes([])
    setIsExclusionMode(false)
    setResult(null)
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-linear-to-b from-background to-muted/20 p-6">
      <header className="mb-8 flex w-full max-w-md items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                step >= s ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <main className="w-full max-w-md flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="flex items-center gap-3 text-3xl font-black">
                  <Wallet className="text-primary" /> เลือกงบประมาณ
                </h1>
                <p className="font-medium text-muted-foreground">
                  มื้อนี้อยากจ่ายเท่าไหร่ดี?
                </p>
              </div>

              <RadioGroup
                value={budget}
                onValueChange={setBudget}
                className="grid grid-cols-2 gap-4"
              >
                {budgetOptions.map((opt) => (
                  <Label
                    key={opt.id}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 p-6 transition-all hover:border-primary/50 ${
                      budget === opt.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border/50 bg-card"
                    }`}
                  >
                    <RadioGroupItem value={opt.id} className="sr-only" />
                    <span
                      className={`text-2xl font-black ${budget === opt.id ? "text-primary" : ""}`}
                    >
                      {opt.label}
                    </span>
                    <span className="mt-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      บาท
                    </span>
                  </Label>
                ))}
              </RadioGroup>

              <Button
                onClick={handleNext}
                className="mt-8 h-16 w-full rounded-2xl text-xl font-bold shadow-xl shadow-primary/20"
              >
                ถัดไป
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h1 className="flex items-center gap-3 text-3xl font-black">
                  <UtensilsCrossed className="text-primary" /> ประเภทอาหาร
                </h1>
                <p className="font-medium text-muted-foreground">
                  {isExclusionMode
                    ? "เลือกประเภทที่ ไม่ต้องการ กิน"
                    : "วันนี้อยากกินแนวไหน?"}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex gap-2 rounded-2xl bg-muted p-1">
                  <button
                    onClick={() => setIsExclusionMode(false)}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                      !isExclusionMode
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    เลือกที่ชอบ
                  </button>
                  <button
                    onClick={toggleExclusionMode}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                      isExclusionMode
                        ? "bg-destructive/10 text-destructive shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    อะไรก็ได้..แต่
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {foodTypes
                    .filter((t) => (isExclusionMode ? t.id !== "any" : true))
                    .map((type) => (
                      <div
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`flex cursor-pointer items-center gap-3 rounded-3xl border-2 p-5 transition-all hover:border-primary/50 ${
                          selectedTypes.includes(type.id)
                            ? isExclusionMode
                              ? "border-destructive bg-destructive/5 shadow-lg shadow-destructive/10"
                              : "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-border/50 bg-card"
                        }`}
                      >
                        <Checkbox
                          checked={selectedTypes.includes(type.id)}
                          className={`h-6 w-6 rounded-full ${isExclusionMode && selectedTypes.includes(type.id) ? "border-destructive data-[state=checked]:bg-destructive" : ""}`}
                        />
                        <span
                          className={`text-lg font-bold ${
                            selectedTypes.includes(type.id)
                              ? isExclusionMode
                                ? "text-destructive"
                                : "text-primary"
                              : ""
                          }`}
                        >
                          {isExclusionMode
                            ? `ไม่ ${type.label}`
                            : `${type.label}`}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-16 flex-1 rounded-2xl border-2 text-xl font-bold"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  onClick={handleRandom}
                  className="h-16 flex-1 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20"
                >
                  สุ่มเลย!
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <div className="relative">
                <div className="absolute -inset-10 animate-pulse rounded-full bg-primary/20 blur-3xl" />
                <div className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={64} className="animate-bounce" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  ผลลัพธ์ที่ได้คือ...
                </h2>
                <Card className="overflow-hidden rounded-[2.5rem] border-4 border-primary/20 shadow-2xl shadow-primary/10">
                  <CardContent className="space-y-4 p-10">
                    <h3 className="text-5xl leading-tight font-black text-primary">
                      {result.name}
                    </h3>
                    {result.price > 0 && (
                      <p className="text-2xl font-bold text-muted-foreground">
                        ราคาโดยประมาณ{" "}
                        <span className="text-foreground">
                          {result.price} บาท
                        </span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 flex w-full flex-col gap-4">
                <Button
                  onClick={handleRandom}
                  className="h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20"
                >
                  <RefreshCw className="mr-2" size={20} /> สุ่มใหม่อีกครั้ง
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="h-16 rounded-2xl border-2 text-xl font-bold"
                >
                  กลับไปตั้งค่าใหม่
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
