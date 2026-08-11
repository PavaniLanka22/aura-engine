const inventoryService = require("../services/inventoryService");
const Product = require("../models/Product");

const getInventory = async (req, res) => {
    try {
        const result =
            await inventoryService.getInventory(
                req.query
            );

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error(
            "Get inventory error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve inventory."
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories =
            await Product.distinct("category");

        categories.sort();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error(
            "Get categories error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to retrieve categories."
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const product =
            await inventoryService.createProduct(
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Product created successfully.",
            data: product
        });
    } catch (error) {
        console.error(
            "Create product error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "A product with this SKU already exists."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to create product."
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product =
            await inventoryService.updateProduct(
                req.params.id,
                req.body
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Product updated successfully.",
            data: product
        });
    } catch (error) {
        console.error(
            "Update product error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "A product with this SKU already exists."
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to update product."
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product =
            await inventoryService.deleteProduct(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Product deleted successfully."
        });
    } catch (error) {
        console.error(
            "Delete product error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete product."
        });
    }
};

module.exports = {
    getInventory,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
};