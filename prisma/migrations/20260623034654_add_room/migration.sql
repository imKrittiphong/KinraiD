-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('LOBBY', 'RANDOMIZING', 'DONE');

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'LOBBY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "result_food_item_id" INTEGER,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_members" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "is_host" BOOLEAN NOT NULL DEFAULT false,
    "selected_type_id" INTEGER,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_room_id_key" ON "rooms"("room_id");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_result_food_item_id_fkey" FOREIGN KEY ("result_food_item_id") REFERENCES "FoodItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_selected_type_id_fkey" FOREIGN KEY ("selected_type_id") REFERENCES "FoodType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
