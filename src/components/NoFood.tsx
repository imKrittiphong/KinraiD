import { Laugh } from "lucide-react"

function NoFood() {
  return (
    <div className="rounded-2xl border border-dashed bg-muted/30 py-16">
  <div className="flex flex-col items-center text-center">
    <Laugh color="#fcc800" className="mb-4 h-12 w-12 text-muted-foreground" />

    <h2 className="text-xl font-semibold">
      ไม่พบข้อมูลเมนูอาหาร
    </h2>

    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
      ขณะนี้ยังไม่มีเมนูอาหารในระบบ กรุณากลับมาตรวจสอบอีกครั้งภายหลัง
    </p>

    <span className="mt-6 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
      วันนี้อดกิน
    </span>
  </div>
</div>
  )
}

export default NoFood
