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
     * Pagination
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
     * Build MongoDB filter
     */

    const filter = {};

    /*
     * Global search
     *
     * Searches product name and SKU.
     */

    if (search.trim()) {
        filter.$or = [
            {
                productName: {
                    $regex: search.trim(),
                    $options: "i"
                }
            },
            {
                sku: {
                    $regex: search.trim(),
                    $options: "i"
                }
            }
        ];
    }

    /*
     * Category filter
     */

    if (category && category.trim()) {
        filter.category = category.trim();
    }

    /*
     * Stock level filter
     */

    if (
        minStock !== undefined ||
        maxStock !== undefined
    ) {
        filter.stockQuantity = {};

        if (minStock !== undefined) {
            filter.stockQuantity.$gte =
                Math.max(
                    Number(minStock) || 0,
                    0
                );
        }

        if (maxStock !== undefined) {
            filter.stockQuantity.$lte =
                Math.max(
                    Number(maxStock) || 0,
                    0
                );
        }

        /*
         * Remove empty stock filter.
         */

        if (
            Object.keys(
                filter.stockQuantity
            ).length === 0
        ) {
            delete filter.stockQuantity;
        }
    }

    /*
     * Price range filter
     */

    if (
        minPrice !== undefined ||
        maxPrice !== undefined
    ) {
        filter.price = {};

        if (minPrice !== undefined) {
            filter.price.$gte =
                Math.max(
                    Number(minPrice) || 0,
                    0
                );
        }

        if (maxPrice !== undefined) {
            filter.price.$lte =
                Math.max(
                    Number(maxPrice) || 0,
                    0
                );
        }

        if (
            Object.keys(filter.price)
                .length === 0
        ) {
            delete filter.price;
        }
    }

    /*
     * Sorting
     *
     * Example:
     * -price → highest first
     * price  → lowest first
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
        allowedSortFields.has(
            cleanSort
        )
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
     * Execute count and paginated query
     * concurrently.
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

const createProduct = async (
    productData
) => {
    const product =
        await Product.create(
            productData
        );

    return product;
};

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