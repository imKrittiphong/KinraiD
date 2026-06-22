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
  Laugh,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { getFoodItems, getFoodTypes } from "@/server/foodItem.function"
import NoFood from "@/components/NoFood"

const budgetOptions = [
  { id: "under50", label: "< 50", value: [0, 50] },
  { id: "50-100", label: "50-100", value: [50, 100] },
  { id: "100-200", label: "100-200", value: [100, 200] },
  { id: "unlimited", label: "ไม่จำกัด", value: [0, 9999] },
]

export const Route = createFileRoute("/solo")({
  loader: async () => {
    const [foodItems, foodTypes] = await Promise.all([
      getFoodItems(),
      getFoodTypes(),
    ])
    return { foodItems, foodTypes }
  },
  component: SoloModePage,
})

function SoloModePage() {
  const { foodItems, foodTypes } = Route.useLoaderData()
  const [step, setStep] = useState(1)
  const [budget, setBudget] = useState("unlimited")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isExclusionMode, setIsExclusionMode] = useState(false)
  const [result, setResult] = useState<{ name: string; price: number } | null>(
    null
  )

  const displayTypes = isExclusionMode
    ? foodTypes
    : [...foodTypes, { id: 0, type: "any", label: "อะไรก็ได้" }]

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
    let filtered = foodItems.filter(
      (item) =>
        item.price >= selectedBudget[0] && item.price <= selectedBudget[1]
    )

    const excludesEveryType =
      isExclusionMode &&
      selectedTypes.length > 0 &&
      foodTypes.every((t) => selectedTypes.includes(t.type))

    if (selectedTypes.includes("any")) {
      // No additional type filtering needed
    } else if (isExclusionMode) {
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(
          (item) => !selectedTypes.includes(item.type.type)
        )
      }
    } else if (selectedTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTypes.includes(item.type.type)
      )
    }

    if (filtered.length > 0) {
      const randomItem = filtered[Math.floor(Math.random() * filtered.length)]
      setResult(randomItem)
    } else if (excludesEveryType) {
      setResult({ name: "ไม่ต้องกิน เลือกอย่างใดอย่างนึง", price: 0 })
    } else {
      setResult({ name: "ไม่พบเมนูที่ตรงตามเงื่อนไข ลองสุ่มใหม่นะ!", price: 0 })
    }
    setStep(4)
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
                    {opt.id === "unlimited" ? (
                      <span className="mt-1" />
                    ) : (
                      <span className="mt-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        บาท
                      </span>
                    )}
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

          {step === 2 &&
            (foodItems.length === 0 ? (
              <motion.div
                key="nofood"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <NoFood />
              </motion.div>
            ) : (
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
                      ? "อะไรก็ได้ไม่มีอยู่จริง..."
                      : "วันนี้อยากกินแบบไหน?"}
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
                    {displayTypes
                      .filter((t) =>
                        isExclusionMode ? t.type !== "any" : true
                      )
                      .map((type) => (
                        <div
                          key={type.id}
                          onClick={() => toggleType(type.type)}
                          className={`flex cursor-pointer items-center gap-3 rounded-3xl border-2 p-5 transition-all hover:border-primary/50 ${
                            selectedTypes.includes(type.type)
                              ? isExclusionMode
                                ? "border-destructive bg-destructive/5 shadow-lg shadow-destructive/10"
                                : "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                              : "border-border/50 bg-card"
                          }`}
                        >
                          <Checkbox
                            checked={selectedTypes.includes(type.type)}
                            className={`h-6 w-6 rounded-full ${isExclusionMode && selectedTypes.includes(type.type) ? "border-destructive data-[state=checked]:bg-destructive" : ""}`}
                          />
                          <span
                            className={`text-lg font-bold ${
                              selectedTypes.includes(type.type)
                                ? isExclusionMode
                                  ? "text-destructive"
                                  : "text-primary"
                                : ""
                            }`}
                          >
                            {isExclusionMode
                              ? `ไม่เอา ${type.label}`
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
                    disabled={selectedTypes.length === 0}
                  >
                    สุ่มเลย!
                  </Button>
                </div>
              </motion.div>
            ))}

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
                  <Laugh size={64} className="animate-bounce" />
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
                  กลับไปเลือกใหม่
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
