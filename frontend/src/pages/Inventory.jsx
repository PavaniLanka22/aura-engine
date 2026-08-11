import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Package,
    RefreshCw,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { getInventory } from "../api/inventoryApi";

import "./Inventory.css";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [stockLevel, setStockLevel] = useState("all");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const limit = 50;

    /* =====================================================
       LOAD INVENTORY
       ===================================================== */

    const loadInventory = async () => {
        try {
            setLoading(true);

            const response = await getInventory({
    page,
    limit,
    search: search.trim(),
    category,
    stockLevel,
    minPrice,
    maxPrice,
    sortField,
    sortOrder,
});

            console.log(
                "INVENTORY BACKEND RESPONSE:",
                response
            );

            /*
             * Expected backend response:
             *
             * {
             *     success: true,
             *     data: [...],
             *     pagination: {
             *         totalRecords: 50001,
             *         totalPages: 1001,
             *         currentPage: 1,
             *         hasNextPage: true,
             *         hasPreviousPage: false,
             *         limit: 50
             *     }
             * }
             */

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Failed to retrieve inventory."
                );
            }

            const items = Array.isArray(
                response.data
            )
                ? response.data
                : [];

            const pagination =
                response.pagination || {};

            console.log(
                "INVENTORY ITEMS:",
                items
            );

            console.log(
                "INVENTORY PAGINATION:",
                pagination
            );

            setProducts(items);

            setTotalRecords(
                Number(
                    pagination.totalRecords ?? 0
                )
            );

            setTotalPages(
                Math.max(
                    1,
                    Number(
                        pagination.totalPages ?? 1
                    )
                )
            );

            if (
                pagination.currentPage &&
                Number(
                    pagination.currentPage
                ) !== page
            ) {
                setPage(
                    Number(
                        pagination.currentPage
                    )
                );
            }
        } catch (error) {
            console.error(
                "Failed to load inventory:",
                error
            );

            console.error(
                "Inventory error response:",
                error?.response?.data
            );

            setProducts([]);
            setTotalRecords(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, [
        page,
        search,
        category,
        stockLevel,
        minPrice,
        maxPrice,
        sortField,
        sortOrder,
    ]);

    /* =====================================================
       CATEGORIES
       ===================================================== */

    const categories = useMemo(() => {
        const values = products
            .map(
                (product) =>
                    product.category
            )
            .filter(Boolean);

        return [
            "all",
            ...new Set(values),
        ];
    }, [products]);

    /* =====================================================
       LOCAL FILTERING
       ===================================================== */

    const filteredProducts = useMemo(() => {
        let result = [...products];

        /* SEARCH */

        if (search.trim()) {
            const query =
                search
                    .toLowerCase()
                    .trim();

            result = result.filter(
                (product) => {
                    const name =
                        String(
                            product.productName ||
                            product.name ||
                            ""
                        ).toLowerCase();

                    const sku =
                        String(
                            product.sku || ""
                        ).toLowerCase();

                    return (
                        name.includes(query) ||
                        sku.includes(query)
                    );
                }
            );
        }

        /* CATEGORY */

        if (category !== "all") {
            result = result.filter(
                (product) =>
                    String(
                        product.category ||
                        ""
                    ).toLowerCase() ===
                    category.toLowerCase()
            );
        }

        /* STOCK LEVEL */

        if (stockLevel !== "all") {
            result = result.filter(
                (product) => {
                    const stock =
                        Number(
                            product.stockQuantity ??
                            product.stock ??
                            0
                        );

                    const reorder =
                        Number(
                            product.reorderLevel ??
                            0
                        );

                    if (
                        stockLevel ===
                        "out"
                    ) {
                        return stock === 0;
                    }

                    if (
                        stockLevel ===
                        "low"
                    ) {
                        return (
                            stock > 0 &&
                            stock <= reorder
                        );
                    }

                    if (
                        stockLevel ===
                        "in"
                    ) {
                        return (
                            stock > reorder
                        );
                    }

                    return true;
                }
            );
        }

        /* MIN PRICE */

        if (minPrice !== "") {
            result = result.filter(
                (product) =>
                    Number(
                        product.price || 0
                    ) >=
                    Number(minPrice)
            );
        }

        /* MAX PRICE */

        if (maxPrice !== "") {
            result = result.filter(
                (product) =>
                    Number(
                        product.price || 0
                    ) <=
                    Number(maxPrice)
            );
        }

        /* SORT */

        if (sortField) {
            result.sort((a, b) => {
                let first;
                let second;

                if (
                    sortField ===
                    "productName"
                ) {
                    first =
                        String(
                            a.productName ||
                            a.name ||
                            ""
                        ).toLowerCase();

                    second =
                        String(
                            b.productName ||
                            b.name ||
                            ""
                        ).toLowerCase();
                }

                if (
                    sortField === "price"
                ) {
                    first =
                        Number(
                            a.price || 0
                        );

                    second =
                        Number(
                            b.price || 0
                        );
                }

                if (
                    sortField === "stock"
                ) {
                    first =
                        Number(
                            a.stockQuantity ??
                            a.stock ??
                            0
                        );

                    second =
                        Number(
                            b.stockQuantity ??
                            b.stock ??
                            0
                        );
                }

                if (first < second) {
                    return sortOrder ===
                        "asc"
                        ? -1
                        : 1;
                }

                if (first > second) {
                    return sortOrder ===
                        "asc"
                        ? 1
                        : -1;
                }

                return 0;
            });
        }

        return result;
    }, [
        products,
        search,
        category,
        stockLevel,
        minPrice,
        maxPrice,
        sortField,
        sortOrder,
    ]);

    /* =====================================================
       SORT
       ===================================================== */

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(
                (current) =>
                    current === "asc"
                        ? "desc"
                        : "asc"
            );
        } else {
            setSortField(field);
            setSortOrder("asc");
        }

        setPage(1);
    };

    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setStockLevel("all");
        setMinPrice("");
        setMaxPrice("");
        setSortField("");
        setSortOrder("asc");
        setPage(1);
    };

    /* =====================================================
       EXPORT CSV
       ===================================================== */

    const exportCSV = () => {
        if (!filteredProducts.length) {
            return;
        }

        const headers = [
            "Product",
            "SKU",
            "Category",
            "Price",
            "Stock",
            "Reorder Level",
            "Status",
        ];

        const rows =
            filteredProducts.map(
                (product) => {
                    const stock =
                        Number(
                            product.stockQuantity ??
                            product.stock ??
                            0
                        );

                    const reorderLevel =
                        Number(
                            product.reorderLevel ??
                            0
                        );

                    let status =
                        "In Stock";

                    if (stock === 0) {
                        status =
                            "Out of Stock";
                    } else if (
                        stock <=
                        reorderLevel
                    ) {
                        status =
                            "Low Stock";
                    }

                    return [
                        product.productName ||
                            product.name ||
                            "",
                        product.sku || "",
                        product.category ||
                            "",
                        product.price || 0,
                        stock,
                        reorderLevel,
                        status,
                    ];
                }
            );

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(
                                value
                            ).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement(
                "a"
            );

        link.href = url;
        link.download =
            "aura-inventory.csv";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(url);
    };

    /* =====================================================
       STATUS
       ===================================================== */

    const getStatus = (product) => {
        const stock =
            Number(
                product.stockQuantity ??
                product.stock ??
                0
            );

        const reorderLevel =
            Number(
                product.reorderLevel ??
                0
            );

        if (stock === 0) {
            return {
                text: "Out of Stock",
                className:
                    "status-danger",
            };
        }

        if (
            stock <= reorderLevel
        ) {
            return {
                text: "Low Stock",
                className:
                    "status-warning",
            };
        }

        return {
            text: "In Stock",
            className:
                "status-success",
        };
    };

    /* =====================================================
       PAGINATION
       ===================================================== */

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(
                (current) =>
                    current - 1
            );
        }
    };

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(
                (current) =>
                    current + 1
            );
        }
    };

    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <main className="inventory-page">

            {/* HEADER */}

            <div className="inventory-header">

                <div>
                    <div className="page-eyebrow">
                        INVENTORY MANAGEMENT
                    </div>

                    <h1>
                        Inventory
                    </h1>

                    <p>
                        Search, filter and
                        monitor enterprise
                        inventory.
                    </p>
                </div>

                <div className="inventory-header-actions">

                    <button
                        className="inventory-export-button"
                        onClick={
                            exportCSV
                        }
                        disabled={
                            !filteredProducts.length
                        }
                    >
                        <Download
                            size={16}
                        />

                        Export CSV
                    </button>

                    <button
                        className="refresh-button"
                        onClick={
                            loadInventory
                        }
                        disabled={
                            loading
                        }
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </div>

            </div>

            {/* FILTER TOOLBAR */}

            <div className="inventory-toolbar">

                {/* SEARCH */}

                <div className="inventory-search">

                    <Search
                        size={18}
                    />

                    <input
                        type="text"
                        value={
                            search
                        }
                        onChange={(
                            event
                        ) => {
                            setSearch(
                                event
                                    .target
                                    .value
                            );

                            setPage(1);
                        }}
                        placeholder="Search products or SKU..."
                    />

                </div>

                {/* CATEGORY */}

                <div className="filter-control">

                    <SlidersHorizontal
                        size={17}
                    />

                    <select
                        value={
                            category
                        }
                        onChange={(
                            event
                        ) => {
                            setCategory(
                                event
                                    .target
                                    .value
                            );

                            setPage(1);
                        }}
                    >
                        <option value="all">
                            All Categories
                        </option>

                        {categories
                            .filter(
                                (item) =>
                                    item !==
                                    "all"
                            )
                            .map(
                                (item) => (
                                    <option
                                        value={
                                            item
                                        }
                                        key={
                                            item
                                        }
                                    >
                                        {
                                            item
                                        }
                                    </option>
                                )
                            )}
                    </select>

                </div>

                {/* STOCK */}

                <div className="filter-control">

                    <select
                        value={
                            stockLevel
                        }
                        onChange={(
                            event
                        ) => {
                            setStockLevel(
                                event
                                    .target
                                    .value
                            );

                            setPage(1);
                        }}
                    >
                        <option value="all">
                            All Stock Levels
                        </option>

                        <option value="in">
                            In Stock
                        </option>

                        <option value="low">
                            Low Stock
                        </option>

                        <option value="out">
                            Out of Stock
                        </option>
                    </select>

                </div>

                {/* PRICE */}

                <div className="price-filter">

                    <span>
                        Price
                    </span>

                    <input
                        type="number"
                        min="0"
                        value={
                            minPrice
                        }
                        onChange={(
                            event
                        ) => {
                            setMinPrice(
                                event
                                    .target
                                    .value
                            );

                            setPage(1);
                        }}
                        placeholder="Min"
                    />

                    <span>
                        –
                    </span>

                    <input
                        type="number"
                        min="0"
                        value={
                            maxPrice
                        }
                        onChange={(
                            event
                        ) => {
                            setMaxPrice(
                                event
                                    .target
                                    .value
                            );

                            setPage(1);
                        }}
                        placeholder="Max"
                    />

                </div>

            </div>

            {/* INVENTORY CARD */}

            <section className="inventory-card">

                {/* CARD HEADER */}

                <div className="inventory-card-header">

                    <div>

                        <h2>
                            Enterprise
                            Inventory
                        </h2>

                        <span>
                            {totalRecords.toLocaleString()}
                            {" "}
                            total records
                        </span>

                    </div>

                    <span className="live-data">
                        Live Data
                    </span>

                </div>

                {/* TABLE */}

                <div className="inventory-table-wrapper">

                    <table className="inventory-table">

                        <thead>

                            <tr>

                                <th>

                                    <button
                                        className="sort-button"
                                        onClick={() =>
                                            handleSort(
                                                "productName"
                                            )
                                        }
                                    >
                                        Product

                                        <ArrowUpDown
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                </th>

                                <th>
                                    SKU
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>

                                    <button
                                        className="sort-button"
                                        onClick={() =>
                                            handleSort(
                                                "price"
                                            )
                                        }
                                    >
                                        Price

                                        <ArrowUpDown
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                </th>

                                <th>

                                    <button
                                        className="sort-button"
                                        onClick={() =>
                                            handleSort(
                                                "stock"
                                            )
                                        }
                                    >
                                        Stock

                                        <ArrowUpDown
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                </th>

                                <th>
                                    Reorder Level
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {/* LOADING */}

                            {loading ? (

                                Array.from(
                                    {
                                        length: 6,
                                    }
                                ).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <tr
                                            className="skeleton-row"
                                            key={
                                                index
                                            }
                                        >
                                            {Array.from(
                                                {
                                                    length: 7,
                                                }
                                            ).map(
                                                (
                                                    __,
                                                    cellIndex
                                                ) => (
                                                    <td
                                                        key={
                                                            cellIndex
                                                        }
                                                    >
                                                        <div className="skeleton" />
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    )
                                )

                            ) : filteredProducts.length ===
                              0 ? (

                                /* EMPTY STATE */

                                <tr className="inventory-empty-row">

                                    <td
                                        colSpan="7"
                                    >

                                        <div className="inventory-empty">

                                            <Package
                                                className="empty-icon"
                                                size={
                                                    48
                                                }
                                                strokeWidth={
                                                    1.7
                                                }
                                            />

                                            <h3>
                                                No inventory found
                                            </h3>

                                            <p>
                                                Try changing
                                                your search
                                                or filters.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={
                                                    clearFilters
                                                }
                                                className="clear-filters-button"
                                            >
                                                Clear Filters
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                /* PRODUCTS */

                                filteredProducts.map(
                                    (
                                        product
                                    ) => {

                                        const status =
                                            getStatus(
                                                product
                                            );

                                        const stock =
                                            Number(
                                                product.stockQuantity ??
                                                product.stock ??
                                                0
                                            );

                                        const reorderLevel =
                                            Number(
                                                product.reorderLevel ??
                                                0
                                            );

                                        return (
                                            <tr
                                                key={
                                                    product._id ||
                                                    product.id ||
                                                    product.sku
                                                }
                                            >

                                                {/* PRODUCT */}

                                                <td>

                                                    <div className="product-cell">

                                                        <div className="product-icon">

                                                            <Package
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    product.productName ||
                                                                    product.name ||
                                                                    "Unnamed Product"
                                                                }
                                                            </strong>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* SKU */}

                                                <td>

                                                    <span className="sku">
                                                        {
                                                            product.sku ||
                                                            "—"
                                                        }
                                                    </span>

                                                </td>

                                                {/* CATEGORY */}

                                                <td>

                                                    <span className="category">
                                                        {
                                                            product.category ||
                                                            "—"
                                                        }
                                                    </span>

                                                </td>

                                                {/* PRICE */}

                                                <td>

                                                    <span className="price">

                                                        $
                                                        {Number(
                                                            product.price ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                minimumFractionDigits:
                                                                    2,
                                                                maximumFractionDigits:
                                                                    2,
                                                            }
                                                        )}

                                                    </span>

                                                </td>

                                                {/* STOCK */}

                                                <td>

                                                    <span className="stock-number">
                                                        {stock.toLocaleString()}
                                                    </span>

                                                </td>

                                                {/* REORDER */}

                                                <td>
                                                    {reorderLevel.toLocaleString()}
                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={
                                                            status.className
                                                        }
                                                    >
                                                        {
                                                            status.text
                                                        }
                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                <div className="inventory-pagination">

                    <div className="pagination-info">

                        Showing{" "}

                        <strong>
                            {
                                filteredProducts.length
                            }
                        </strong>

                        {" "}records on page{" "}

                        <strong>
                            {page}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {totalPages}
                        </strong>

                        {" "}(
                        {totalRecords.toLocaleString()}
                        {" "}total)

                    </div>

                    <div className="pagination-controls">

                        <button
                            onClick={
                                goToPreviousPage
                            }
                            disabled={
                                page ===
                                    1 ||
                                loading
                            }
                            aria-label="Previous page"
                        >
                            <ChevronLeft
                                size={
                                    17
                                }
                            />
                        </button>

                        <span>
                            Page {page}
                        </span>

                        <button
                            onClick={
                                goToNextPage
                            }
                            disabled={
                                page >=
                                    totalPages ||
                                loading
                            }
                            aria-label="Next page"
                        >
                            <ChevronRight
                                size={
                                    17
                                }
                            />
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Inventory;