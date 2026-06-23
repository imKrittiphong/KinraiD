// src/server/room.ts
import { createServerFn } from "@tanstack/react-start"
import { randomBytes } from "node:crypto"
import { prisma } from "@/lib/prisma"

const ROOM_TTL_MS = 1000 * 60 * 60 * 2

export const createRoom = createServerFn({ method: "POST" })
  .validator((d: { ownerName: string; roomName?: string; section?: string }) => d)
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
    const room = await prisma.room.findUnique({ where: { roomId: data.roomId } })
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
      include: { members: { orderBy: { joinedAt: "asc" } } },
    })
    if (!room) throw new Error("ไม่พบห้องนี้")
    return { status: room.status, members: room.members }
  })