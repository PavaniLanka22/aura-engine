const express = require("express");

const {
    getInventory,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/inventoryController");

const {
    validateProduct
} = require("../middleware/validation");

const router = express.Router();

/*
 * GET /api/inventory/categories
 */

router.get(
    "/categories",
    getCategories
);

/*
 * GET /api/inventory
 *
 * Supports:
 * page
 * limit
 * search
 * category
 * minStock
 * maxStock
 * minPrice
 * maxPrice
 * sort
 */

router.get(
    "/",
    getInventory
);

/*
 * POST /api/inventory
 */

router.post(
    "/",
    validateProduct,
    createProduct
);

/*
 * PUT /api/inventory/:id
 */

router.put(
    "/:id",
    validateProduct,
    updateProduct
);

/*
 * DELETE /api/inventory/:id
 */

router.delete(
    "/:id",
    deleteProduct
);

module.exports = router;