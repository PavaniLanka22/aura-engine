const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        cost: {
            type: Number,
            required: true,
            min: 0
        },

        stockQuantity: {
            type: Number,
            required: true,
            min: 0
        },

        reorderLevel: {
            type: Number,
            required: true,
            min: 0
        },

        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

/*
 * Required indexes.
 *
 * SKU already receives a unique index through
 * unique: true in the schema definition.
 */

productSchema.index({
    category: 1
});

productSchema.index({
    productName: "text"
});

/*
 * Compound index for category + stock queries.
 */

productSchema.index({
    category: 1,
    stockQuantity: 1
});

module.exports = mongoose.model(
    "Product",
    productSchema
);