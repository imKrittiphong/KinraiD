// src/server/room.ts
import { createServerFn } from "@tanstack/react-start"
import { randomBytes } from "node:crypto"
import { prisma } from "@/lib/prisma"

const ROOM_TTL_MS = 1000 * 60 * 60 * 2

export const getFoodTypes = createServerFn({ method: "GET" }).handler(
  async () => {
    return prisma.foodType.findMany({ orderBy: { label: "asc" } })
  }
)

export const selectFoodType = createServerFn({ method: "POST" })
  .validator((d: { memberId: number; typeId: number | "any" }) => d)
  .handler(async ({ data }) => {
    return prisma.roomMember.update({
      where: { id: data.memberId },
      data:
        data.typeId === "any"
          ? { selectedTypeId: null, wantsAny: true }
          : { selectedTypeId: data.typeId, wantsAny: false },
    })
  })

export const randomizeRoom = createServerFn({ method: "POST" })
  .validator((d: { roomId: string; token: string }) => d)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: { roomId: data.roomId },
      include: { members: true },
    })
    if (!room || room.token !== data.token) throw new Error("ไม่มีสิทธิ์สุ่ม")
    if (room.status !== "RANDOMIZING") throw new Error("สถานะห้องไม่ถูกต้อง")

    const explicitTypeIds = new Set(
      room.members
        .map((m) => m.selectedTypeId)
        .filter((id): id is number => id !== null)
    )
    const anyPicked = room.members.some((m) => m.wantsAny)

    let typeIdPool = [...explicitTypeIds]
    if (anyPicked) {
      const allTypes = await prisma.foodType.findMany({ select: { id: true } })
      typeIdPool = [...new Set([...typeIdPool, ...allTypes.map((t) => t.id)])]
    }
    if (typeIdPool.length === 0)
      throw new Error("ยังไม่มีใครเลือกประเภทอาหารเลย")

    const pickedTypeId =
      typeIdPool[Math.floor(Math.random() * typeIdPool.length)]
    const candidates = await prisma.foodItem.findMany({
      where: { typeId: pickedTypeId },
    })
    if (candidates.length === 0) throw new Error("ประเภทนี้ยังไม่มีเมนูในระบบ")

    const pickedFood = candidates[Math.floor(Math.random() * candidates.length)]

    return prisma.room.update({
      where: { id: room.id },
      data: { status: "DONE", resultFoodItemId: pickedFood.id },
      include: { resultFoodItem: { include: { type: true } } },
    })
  })

export const createRoom = createServerFn({ method: "POST" })
  .validator(
    (d: { ownerName: string; roomName?: string; section?: string }) => d
  )
  .handler(async ({ data }) => {
    const token = randomBytes(16).toString("hex")

    const room = await prisma.room.create({
      data: {
        roomName: data.roomName ?? `ห้องของ ${data.ownerName}`,
        section: data.section ?? "lunch",
        token,
        expiresAt: new Date(Date.now() + ROOM_TTL_MS),
        members: {
          create: { nickname: data.ownerName, isHost: true },
        },
      },
      include: { members: true },
    })

    return {
      roomId: room.roomId,
      token: room.token,
      member: room.members[0],
    }
  })

export const joinRoom = createServerFn({ method: "POST" })
  .validator((d: { roomId: string; nickname: string }) => d)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: { roomId: data.roomId },
    })
    if (!room) throw new Error("ไม่พบห้องนี้")
    if (room.status !== "LOBBY") throw new Error("ห้องนี้ปิดรับสมาชิกแล้ว")
    if (room.expiresAt < new Date()) throw new Error("ห้องนี้หมดอายุแล้ว")

    const member = await prisma.roomMember.create({
      data: { roomId: room.id, nickname: data.nickname, isHost: false },
    })

    return { member, roomId: room.roomId }
  })

export const getRoomMembers = createServerFn({ method: "GET" })
  .validator((d: { roomId: string }) => d)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: { roomId: data.roomId },
      include: {
        members: { orderBy: { joinedAt: "asc" } },
        resultFoodItem: { include: { type: true } },
      },
    })
    if (!room) throw new Error("ไม่พบห้องนี้")
    return {
      status: room.status,
      members: room.members,
      result: room.resultFoodItem,
    }
  })

export const startSelecting = createServerFn({ method: "POST" })
  .validator((d: { roomId: string; token: string }) => d)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: { roomId: data.roomId },
    })
    if (!room || room.token !== data.token) throw new Error("ไม่มีสิทธิ์เริ่ม")
    if (room.status !== "LOBBY") throw new Error("เริ่มไปแล้ว")

    return prisma.room.update({
      where: { id: room.id },
      data: { status: "SELECTING" },
    })
  })

export const startRandomizing = createServerFn({ method: "POST" })
  .validator((d: { roomId: string; token: string }) => d)
  .handler(async ({ data }) => {
    const room = await prisma.room.findUnique({
      where: { roomId: data.roomId },
    })
    if (!room || room.token !== data.token) throw new Error("ไม่มีสิทธิ์สุ่ม")
    if (room.status !== "SELECTING") throw new Error("สถานะห้องไม่ถูกต้อง")

    return prisma.room.update({
      where: { id: room.id },
      data: { status: "RANDOMIZING" },
    })
  })

export const exsitRoom = createServerFn({ method: "POST" })
  .validator((d: { roomId: string; token: string }) => d)
  .handler(async ({data}) => {
    const room = await prisma.room.findUnique({
      where: { roomId: data.roomId },
    })

    return prisma.room.update({
        where: {id: room?.id},
        data: {
            status: "CANCELED"
        }
    })
  })
