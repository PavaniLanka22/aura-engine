require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Product = require("./models/Product");

const TOTAL_PRODUCTS = 50000;
const BATCH_SIZE = 1000;

const categories = [
    "Electronics",
    "Apparel",
    "Home & Kitchen",
    "Grocery",
    "Sports",
    "Beauty",
    "Office Supplies",
    "Toys",
    "Automotive",
    "Health"
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB.");

        console.log("Clearing existing products...");

        await Product.deleteMany({});

        console.log("Generating 50,000 products...");

        let totalInserted = 0;

        for (
            let batchStart = 0;
            batchStart < TOTAL_PRODUCTS;
            batchStart += BATCH_SIZE
        ) {
            const products = [];

            const currentBatchSize = Math.min(
                BATCH_SIZE,
                TOTAL_PRODUCTS - batchStart
            );

            for (let i = 0; i < currentBatchSize; i++) {
                const category =
                    faker.helpers.arrayElement(categories);

                const cost = Number(
                    faker.number.float({
                        min: 5,
                        max: 1000,
                        fractionDigits: 2
                    })
                );

                const markup = faker.number.float({
                    min: 1.1,
                    max: 2.5,
                    fractionDigits: 2
                });

                const price = Number(
                    (cost * markup).toFixed(2)
                );

                const stockQuantity =
                    faker.number.int({
                        min: 0,
                        max: 500
                    });

                const reorderLevel =
                    faker.number.int({
                        min: 10,
                        max: 100
                    });

                products.push({
                    productName: faker.commerce.productName(),

                    sku: `AURA-${String(
                        batchStart + i + 1
                    ).padStart(6, "0")}`,

                    category,

                    price,

                    cost,

                    stockQuantity,

                    reorderLevel,

                    lastUpdated: faker.date.recent({
                        days: 90
                    })
                });
            }

            await Product.insertMany(products, {
                ordered: false
            });

            totalInserted += products.length;

            console.log(
                `Inserted ${totalInserted}/${TOTAL_PRODUCTS}`
            );
        }

        console.log(
            `Successfully seeded ${totalInserted} products.`
        );

        await mongoose.disconnect();

        console.log("Database connection closed.");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedDatabase();