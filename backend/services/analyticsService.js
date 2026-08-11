const Product = require("../models/Product");

const getAnalytics = async () => {
    const summaryResult = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalSKUs: {
                    $sum: 1
                },
                totalInventoryValue: {
                    $sum: {
                        $multiply: [
                            "$price",
                            "$stockQuantity"
                        ]
                    }
                },
                outOfStockItems: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$stockQuantity",
                                    0
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalSKUs: 1,
                totalInventoryValue: 1,
                outOfStockItems: 1
            }
        }
    ]);

    const categoryDistribution = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                totalValuation: {
                    $sum: {
                        $multiply: [
                            "$price",
                            "$stockQuantity"
                        ]
                    }
                },
                totalUnits: {
                    $sum: "$stockQuantity"
                }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                totalValuation: 1,
                totalUnits: 1
            }
        },
        {
            $sort: {
                totalValuation: -1
            }
        }
    ]);

    const restockPriority = await Product.aggregate([
        {
            $match: {
                $expr: {
                    $lte: [
                        "$stockQuantity",
                        "$reorderLevel"
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                productName: 1,
                sku: 1,
                category: 1,
                stockQuantity: 1,
                reorderLevel: 1,
                price: 1
            }
        },
        {
            $sort: {
                stockQuantity: 1
            }
        },
        {
            $limit: 10
        }
    ]);

    return {
        summary: summaryResult[0] || {
            totalSKUs: 0,
            totalInventoryValue: 0,
            outOfStockItems: 0
        },
        categoryDistribution,
        restockPriority
    };
};

module.exports = {
    getAnalytics
};