import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

function ResultScreen({ result }: { result: { name: string; price: number; type: { label: string } } }) {

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="animate-in rounded-3xl border bg-card p-8 text-center shadow-sm duration-500 fade-in zoom-in-95">
        <div className="mb-4 text-6xl">🎉</div>
        <p className="text-muted-foreground">วันนี้ทุกคนกิน</p>
        <h2 className="mt-2 text-3xl font-black">อาหาร: {result.type.label}</h2>
      </div>
      <div >
        <Link to="/" className="grid mt-6">
        <Button variant="default" size="lg" className="h-16 text-xl font-bold">กลับหน้าหลัก</Button>
        </Link>
      </div>
    </main>
  )
} export default ResultScreen