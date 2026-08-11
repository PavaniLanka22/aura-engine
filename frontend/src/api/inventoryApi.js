import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    console.warn(
        "VITE_API_URL is not configured. Please create a frontend .env file."
    );
}


/*
 * Get inventory
 *
 * IMPORTANT:
 * We only send parameters that the backend
 * inventoryService actually understands.
 */
export const getInventory = async (params = {}) => {
    const queryParams = {
        page: params.page ?? 1,
        limit: params.limit ?? 50,
    };

    /*
     * Only add filters when they actually have a value.
     */

    if (
        params.search !== undefined &&
        params.search !== null &&
        String(params.search).trim() !== ""
    ) {
        queryParams.search =
            String(params.search).trim();
    }

    if (
        params.category !== undefined &&
        params.category !== null &&
        String(params.category).trim() !== "" &&
        params.category !== "all"
    ) {
        queryParams.category =
            String(params.category).trim();
    }

    /*
     * Price filters
     */

    if (
        params.minPrice !== undefined &&
        params.minPrice !== null &&
        String(params.minPrice).trim() !== ""
    ) {
        queryParams.minPrice =
            params.minPrice;
    }

    if (
        params.maxPrice !== undefined &&
        params.maxPrice !== null &&
        String(params.maxPrice).trim() !== ""
    ) {
        queryParams.maxPrice =
            params.maxPrice;
    }

    /*
     * Stock filters
     *
     * Your backend expects minStock/maxStock.
     */

    if (params.stockLevel === "out") {
        queryParams.minStock = 0;
        queryParams.maxStock = 0;
    }

    if (params.stockLevel === "low") {
        /*
         * Low stock depends on reorderLevel,
         * so don't send a stock range here.
         * It will be handled on the frontend.
         */
    }

    /*
     * Sorting
     *
     * Backend expects `sort`.
     */

    if (params.sortField) {
        const sortMap = {
            productName: "productName",
            price: "price",
            stock: "stockQuantity",
        };

        const backendSort =
            sortMap[params.sortField];

        if (backendSort) {
            queryParams.sort =
                params.sortOrder === "desc"
                    ? `-${backendSort}`
                    : backendSort;
        }
    }

    console.log(
        "INVENTORY API URL:",
        `${API_BASE_URL}/inventory`
    );

    console.log(
        "INVENTORY API PARAMS:",
        queryParams
    );

    const response = await axios.get(
        `${API_BASE_URL}/inventory`,
        {
            params: queryParams,
            headers: {
                Accept: "application/json",
            },
        }
    );

    console.log(
        "INVENTORY API RESPONSE:",
        response.data
    );

    return response.data;
};


/*
 * Export inventory
 */

export const exportInventory = async (
    params = {}
) => {
    const response = await axios.get(
        `${API_BASE_URL}/inventory/export`,
        {
            params,
            responseType: "blob",
        }
    );

    return response.data;
};