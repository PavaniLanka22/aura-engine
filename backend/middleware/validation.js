const Joi = require("joi");

const productSchema = Joi.object({
    productName: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages({
            "string.empty":
                "Product name is required.",
            "any.required":
                "Product name is required."
        }),

    sku: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty":
                "SKU is required.",
            "any.required":
                "SKU is required."
        }),

    category: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty":
                "Category is required.",
            "any.required":
                "Category is required."
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.min":
                "Price cannot be negative.",
            "any.required":
                "Price is required."
        }),

    cost: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.min":
                "Cost cannot be negative.",
            "any.required":
                "Cost is required."
        }),

    stockQuantity: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.min":
                "Stock quantity cannot be negative.",
            "number.integer":
                "Stock quantity must be an integer.",
            "any.required":
                "Stock quantity is required."
        }),

    reorderLevel: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.min":
                "Reorder level cannot be negative.",
            "number.integer":
                "Reorder level must be an integer.",
            "any.required":
                "Reorder level is required."
        }),

    lastUpdated: Joi.date()
        .optional()
});

const validateProduct = (req, res, next) => {
    const { error, value } =
        productSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true
            }
        );

    /*
     * Joi validation failed.
     */

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: error.details.map(
                (detail) => detail.message
            )
        });
    }

    /*
     * Business Rule 1:
     *
     * Price cannot be lower than cost.
     */

    if (value.price < value.cost) {
        return res.status(400).json({
            success: false,
            message:
                "Price cannot be lower than cost."
        });
    }

    /*
     * Business Rule 2:
     *
     * Stock quantity cannot be negative.
     *
     * Joi already checks this, but keeping the
     * business rule explicit makes the requirement
     * clear and protects the API layer.
     */

    if (value.stockQuantity < 0) {
        return res.status(400).json({
            success: false,
            message:
                "Stock quantity cannot be negative."
        });
    }

    req.body = value;

    next();
};

module.exports = {
    validateProduct
};