import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.foodItem.deleteMany();
  await prisma.foodType.deleteMany();

  const typeData = [
    { type: "rice", label: "ข้าวตามสั่ง" },
    { type: "fastfood", label: "ฟาสต์ฟูด" },
    { type: "esan", label: "อาหารอีสาน" },
    { type: "noodle", label: "ก๋วยเตี๋ยว" },
    { type: "japanese", label: "ญี่ปุ่น" },
    { type: "korean", label: "เกาหลี" },
    { type: "dessert", label: "ของหวาน" },
  ];

  const typeMap: Record<string, number> = {};
  for (const t of typeData) {
    const created = await prisma.foodType.create({ data: t });
    typeMap[t.type] = created.id;
  }

  await prisma.foodItem.createMany({
    data: [
      // rice
      { name: "กะเพราไก่ไข่ดาว", price: 70, typeId: typeMap.rice },
      { name: "ข้าวมันไก่", price: 50, typeId: typeMap.rice },
      { name: "ข้าวหมูกรอบ", price: 70, typeId: typeMap.rice },

      // fastfood
      { name: "ชีสเบอร์เกอร์", price: 139, typeId: typeMap.fastfood },
      { name: "ไก่ทอด", price: 99, typeId: typeMap.fastfood },

      // esan
      { name: "ส้มตำ", price: 60, typeId: typeMap.esan },
      { name: "ลาบ", price: 90, typeId: typeMap.esan },

      // noodle
      { name: "ก๋วยเตี๋ยวเรือ", price: 50, typeId: typeMap.noodle },
      { name: "ผัดไทยกุ้งสด", price: 80, typeId: typeMap.noodle },

      // japanese
      { name: "ราเมงทงคัตสึ", price: 180, typeId: typeMap.japanese },
      { name: "ซูชิรวม", price: 250, typeId: typeMap.japanese },

      // korean
      { name: "บิบิมบับ", price: 180, typeId: typeMap.korean },
      { name: "ต๊อกบกกี", price: 130, typeId: typeMap.korean },

      // dessert
      { name: "ขนมครก", price: 30, typeId: typeMap.dessert },
      { name: "ข้าวเหนียวมะม่วง", price: 120, typeId: typeMap.dessert },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });