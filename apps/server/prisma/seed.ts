import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const sweets = [
    {
      name: "Chocolate Truffle",
      category: "Chocolate",
      description: "Rich dark chocolate truffle with cocoa powder coating",
      price: 2.99,
      quantity: 100,
      imageUrl:
        "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
    },
    {
      name: "Strawberry Gummy",
      category: "Gummy",
      description: "Soft and chewy strawberry-flavored gummy candy",
      price: 1.49,
      quantity: 200,
      imageUrl:
        "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400",
    },
    {
      name: "Vanilla Fudge",
      category: "Fudge",
      description: "Creamy vanilla fudge with a smooth texture",
      price: 3.49,
      quantity: 75,
      imageUrl:
        "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400",
    },
    {
      name: "Mint Chocolate",
      category: "Chocolate",
      description: "Refreshing mint chocolate with a cool finish",
      price: 2.79,
      quantity: 120,
      imageUrl:
        "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
    },
    {
      name: "Caramel Chew",
      category: "Caramel",
      description: "Soft caramel chew with a buttery flavor",
      price: 1.99,
      quantity: 150,
      imageUrl:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
    },
    {
      name: "Lemon Drop",
      category: "Hard Candy",
      description: "Tangy lemon-flavored hard candy",
      price: 0.99,
      quantity: 300,
      imageUrl:
        "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
    },
    {
      name: "Peanut Butter Cup",
      category: "Chocolate",
      description: "Chocolate cup filled with creamy peanut butter",
      price: 3.99,
      quantity: 80,
      imageUrl:
        "https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400",
    },
    {
      name: "Raspberry Licorice",
      category: "Licorice",
      description: "Sweet raspberry-flavored licorice twists",
      price: 2.29,
      quantity: 90,
      imageUrl:
        "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400",
    },
    {
      name: "Butterscotch Disc",
      category: "Hard Candy",
      description: "Classic butterscotch hard candy disc",
      price: 1.29,
      quantity: 250,
      imageUrl:
        "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400",
    },
    {
      name: "Coconut Cluster",
      category: "Chocolate",
      description: "Chocolate cluster with toasted coconut flakes",
      price: 3.29,
      quantity: 60,
      imageUrl:
        "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
    },
  ];

  // Clear existing sweets and create new ones
  await prisma.sweet.deleteMany({});
  await prisma.sweet.createMany({
    data: sweets,
  });

  console.log("Sweets seeded successfully");
  console.log(`Created ${sweets.length} sample sweets`);
  console.log("");
  console.log("To create an admin user:");
  console.log("1. Register a user through the app");
  console.log(
    "2. Run: UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'your@email.com';"
  );
  console.log("   or use Prisma Studio: npx prisma studio");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
