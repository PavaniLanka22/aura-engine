const Product = require("../models/Product");

const getInventory = async (queryParams) => {
    const {
        page = 1,
        limit = 50,
        search = "",
        category,
        minStock,
        maxStock,
        minPrice,
        maxPrice,
        sort = "-createdAt"
    } = queryParams;

    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const currentPage = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const recordsPerPage = Math.min(
        Math.max(
            parseInt(limit, 10) || 50,
            1
        ),
        100
    );

    const skip =
        (currentPage - 1) *
        recordsPerPage;

    /*
     * =====================================================
     * MONGODB FILTER
     * =====================================================
     */

    const filter = {};

    /*
     * =====================================================
     * SEARCH
     * =====================================================
     */

    if (
        typeof search === "string" &&
        search.trim() !== ""
    ) {
        const searchValue = search.trim();

        filter.$or = [
            {
                productName: {
                    $regex: searchValue,
                    $options: "i"
                }
            },
            {
                sku: {
                    $regex: searchValue,
                    $options: "i"
                }
            }
        ];
    }

    /*
     * =====================================================
     * CATEGORY
     * =====================================================
     */

    if (
        typeof category === "string" &&
        category.trim() !== ""
    ) {
        filter.category = category.trim();
    }

    /*
     * =====================================================
     * STOCK RANGE
     *
     * IMPORTANT:
     * Ignore empty strings.
     * =====================================================
     */

    const hasMinStock =
        minStock !== undefined &&
        minStock !== null &&
        String(minStock).trim() !== "";

    const hasMaxStock =
        maxStock !== undefined &&
        maxStock !== null &&
        String(maxStock).trim() !== "";

    if (hasMinStock || hasMaxStock) {
        filter.stockQuantity = {};

        if (hasMinStock) {
            filter.stockQuantity.$gte =
                Math.max(
                    Number(minStock) || 0,
                    0
                );
        }

        if (hasMaxStock) {
            filter.stockQuantity.$lte =
                Math.max(
                    Number(maxStock) || 0,
                    0
                );
        }
    }

    /*
     * =====================================================
     * PRICE RANGE
     *
     * IMPORTANT:
     * Ignore empty strings.
     *
     * This fixes the 0-record problem.
     * =====================================================
     */

    const hasMinPrice =
        minPrice !== undefined &&
        minPrice !== null &&
        String(minPrice).trim() !== "";

    const hasMaxPrice =
        maxPrice !== undefined &&
        maxPrice !== null &&
        String(maxPrice).trim() !== "";

    if (hasMinPrice || hasMaxPrice) {
        filter.price = {};

        if (hasMinPrice) {
            filter.price.$gte =
                Math.max(
                    Number(minPrice) || 0,
                    0
                );
        }

        if (hasMaxPrice) {
            filter.price.$lte =
                Math.max(
                    Number(maxPrice) || 0,
                    0
                );
        }
    }

    /*
     * =====================================================
     * SORTING
     * =====================================================
     */

    const allowedSortFields = new Set([
        "price",
        "productName",
        "stockQuantity",
        "category",
        "lastUpdated",
        "createdAt"
    ]);

    let sortField = "createdAt";
    let sortDirection = -1;

    const requestedSort =
        String(sort || "-createdAt");

    const cleanSort =
        requestedSort.startsWith("-")
            ? requestedSort.substring(1)
            : requestedSort;

    if (
        allowedSortFields.has(cleanSort)
    ) {
        sortField = cleanSort;

        sortDirection =
            requestedSort.startsWith("-")
                ? -1
                : 1;
    }

    const sortObject = {
        [sortField]: sortDirection
    };

    /*
     * =====================================================
     * DEBUG
     * =====================================================
     */

    console.log(
        "INVENTORY QUERY:",
        queryParams
    );

    console.log(
        "INVENTORY MONGO FILTER:",
        filter
    );

    console.log(
        "INVENTORY SORT:",
        sortObject
    );

    /*
     * =====================================================
     * DATABASE QUERY
     * =====================================================
     */

    const [
        totalRecords,
        products
    ] = await Promise.all([
        Product.countDocuments(filter),

        Product.find(filter)
            .sort(sortObject)
            .skip(skip)
            .limit(recordsPerPage)
            .lean()
    ]);

    /*
     * =====================================================
     * PAGINATION RESULT
     * =====================================================
     */

    const totalPages =
        Math.ceil(
            totalRecords /
            recordsPerPage
        );

    return {
        data: products,

        pagination: {
            totalRecords,

            totalPages,

            currentPage,

            hasNextPage:
                currentPage <
                totalPages,

            hasPreviousPage:
                currentPage > 1,

            limit: recordsPerPage
        }
    };
};


/*
 * =====================================================
 * CREATE PRODUCT
 * =====================================================
 */

const createProduct = async (
    productData
) => {
    const product =
        await Product.create(
            productData
        );

    return product;
};


/*
 * =====================================================
 * UPDATE PRODUCT
 * =====================================================
 */

const updateProduct = async (
    productId,
    productData
) => {
    const product =
        await Product.findByIdAndUpdate(
            productId,
            {
                ...productData,
                lastUpdated: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

    return product;
};


/*
 * =====================================================
 * DELETE PRODUCT
 * =====================================================
 */

const deleteProduct = async (
    productId
) => {
    const product =
        await Product.findByIdAndDelete(
            productId
        );

    return product;
};


module.exports = {
    getInventory,
    createProduct,
    updateProduct,
    deleteProduct
};