import { useEffect, useState } from "react";

import {
    Activity,
    AlertTriangle,
    DollarSign,
    Package
} from "lucide-react";

import { getAnalytics } from "../api/analyticsApi";

import KpiCard from "../components/KpiCard";
import RestockChart from "../components/RestockChart";
import PortfolioChart from "../components/PortfolioChart";

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getAnalytics();

                console.log(
                    "FULL ANALYTICS RESPONSE:",
                    response
                );

                /*
                 * Backend response:
                 *
                 * {
                 *   success: true,
                 *   data: {
                 *      summary: {...},
                 *      restockPriority: [...],
                 *      categoryDistribution: [...]
                 *   }
                 * }
                 */

                const analyticsData =
                    response?.data ?? response;

                /*
                 * IMPORTANT DEBUG LOG
                 *
                 * This prints the exact objects returned
                 * by the backend for the restock chart.
                 */

                console.log(
                    "RESTOCK PRIORITY RAW:",
                    JSON.stringify(
                        analyticsData?.restockPriority,
                        null,
                        2
                    )
                );

                /*
                 * Also print the first object separately.
                 * This makes it easy to inspect its exact
                 * property names in DevTools.
                 */

                if (
                    analyticsData?.restockPriority &&
                    analyticsData.restockPriority.length > 0
                ) {
                    console.log(
                        "FIRST RESTOCK ITEM:",
                        analyticsData.restockPriority[0]
                    );

                    console.log(
                        "FIRST RESTOCK ITEM KEYS:",
                        Object.keys(
                            analyticsData.restockPriority[0]
                        )
                    );
                }

                setAnalytics(analyticsData);

            } catch (err) {
                console.error(
                    "Analytics error:",
                    err
                );

                setError(
                    "Unable to load analytics."
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    /*
     * Summary
     */

    const summary =
        analytics?.summary ?? {};

    /*
     * KPI 1
     */

    const totalSkus =
        summary.totalSKUs ??
        summary.totalSkus ??
        summary.totalProducts ??
        summary.totalRecords ??
        0;

    /*
     * KPI 2
     */

    const totalInventoryValue =
        summary.totalInventoryValue ??
        summary.totalInventoryValuation ??
        summary.inventoryValue ??
        summary.totalValue ??
        0;

    /*
     * KPI 3
     */

    const outOfStock =
        summary.outOfStockItems ??
        summary.outOfStockCount ??
        summary.outOfStock ??
        0;

    /*
     * Restock Priority
     */

    const restockData =
        analytics?.restockPriority ?? [];

    /*
     * Category Distribution
     */

    const portfolioData =
        analytics?.categoryDistribution ?? [];

    /*
     * Currency formatting
     */

    const formattedValue =
        Number(
            totalInventoryValue
        ).toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
            }
        );

    return (
        <main className="dashboard">

            {/* ================================
                PAGE HEADER
            ================================= */}

            <div className="page-heading">

                <div>

                    <p className="eyebrow">
                        OPERATIONS OVERVIEW
                    </p>

                    <h1>
                        Command Center
                    </h1>

                    <p className="page-description">
                        Real-time visibility into
                        your enterprise inventory.
                    </p>

                </div>

                <div className="system-live">

                    <span></span>

                    Live Data

                </div>

            </div>

            {/* ================================
                ERROR
            ================================= */}

            {error && (
                <div className="analytics-error">
                    {error}
                </div>
            )}

            {/* ================================
                KPI CARDS
            ================================= */}

            <section className="stats-grid">

                <KpiCard
                    icon={
                        <Package size={21} />
                    }
                    label="Total SKUs"
                    value={
                        loading
                            ? "..."
                            : Number(
                                totalSkus
                            ).toLocaleString()
                    }
                    description="Across all categories"
                    status="Live"
                />

                <KpiCard
                    icon={
                        <DollarSign size={21} />
                    }
                    label="Inventory Value"
                    value={
                        loading
                            ? "..."
                            : formattedValue
                    }
                    description="Current stock valuation"
                    status="Live"
                />

                <KpiCard
                    icon={
                        <AlertTriangle
                            size={21}
                        />
                    }
                    label="Out of Stock"
                    value={
                        loading
                            ? "..."
                            : Number(
                                outOfStock
                            ).toLocaleString()
                    }
                    description="Products requiring action"
                    status="Attention"
                    warning={true}
                />

                <KpiCard
                    icon={
                        <Activity size={21} />
                    }
                    label="System Status"
                    value="Healthy"
                    description="Inventory engine operational"
                    status="Active"
                />

            </section>

            {/* ================================
                ANALYTICS
            ================================= */}

            <section className="analytics-grid">

                {/* ============================
                    RESTOCK PRIORITY
                ============================= */}

                <div className="chart-card">

                    <div className="card-heading">

                        <div>

                            <h3>
                                Restock Priority
                            </h3>

                            <p>
                                Top 10 products
                                with the lowest
                                stock levels
                            </p>

                        </div>

                    </div>

                    <RestockChart
                        data={restockData}
                    />

                </div>

                {/* ============================
                    PORTFOLIO DISTRIBUTION
                ============================= */}

                <div className="chart-card">

                    <div className="card-heading">

                        <div>

                            <h3>
                                Portfolio Distribution
                            </h3>

                            <p>
                                Inventory valuation
                                by category
                            </p>

                        </div>

                    </div>

                    <PortfolioChart
                        data={portfolioData}
                    />

                </div>

            </section>

        </main>
    );
};

export default Dashboard;