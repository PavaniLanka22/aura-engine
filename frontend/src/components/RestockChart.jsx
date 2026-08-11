import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const RestockChart = ({ data = [] }) => {
    console.log("RESTOCK CHART RAW DATA:", data);

    /*
     * Convert a value safely to a number.
     */
    const toNumber = (value) => {
        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : 0;
    };

    /*
     * Backend already returns:
     *
     * productName
     * stockQuantity
     * reorderLevel
     *
     * So we map those exact fields here.
     */
    const chartData = data.map((item) => ({
        name:
            item?.productName ||
            "Unknown Product",

        stock:
            toNumber(
                item?.stockQuantity
            ),

        reorderLevel:
            toNumber(
                item?.reorderLevel
            )
    }));

    console.log(
        "RESTOCK CHART FINAL DATA:",
        chartData
    );

    /*
     * Find the largest value so the chart
     * has a sensible X-axis.
     */
    const maximumValue = Math.max(
        ...chartData.map(
            (item) =>
                Math.max(
                    item.stock,
                    item.reorderLevel
                )
        ),
        0
    );

    /*
     * Give the chart some breathing room.
     */
    const chartMaximum =
        maximumValue === 0
            ? 10
            : Math.ceil(
                maximumValue * 1.15
            );

    /*
     * Empty state.
     */
    if (chartData.length === 0) {
        return (
            <div className="chart-empty">
                No restock data available.
            </div>
        );
    }

    return (
        <div
            className="chart-container"
            style={{
                width: "100%",
                height: "100%"
            }}
        >
            <ResponsiveContainer
                width="100%"
                height="100%"
            >
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                    />

                    <XAxis
                        type="number"
                        domain={[
                            0,
                            chartMaximum
                        ]}
                        allowDecimals={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        width={155}
                        tick={{
                            fontSize: 11
                        }}
                    />

                    <Tooltip
                        formatter={(
                            value,
                            name
                        ) => {

                            if (
                                name ===
                                "Current Stock"
                            ) {
                                return [
                                    `${value} units`,
                                    name
                                ];
                            }

                            return [
                                `${value} units`,
                                name
                            ];
                        }}
                    />

                    <Legend />

                    {/* 
                     * Actual current inventory.
                     */}
                    <Bar
                        dataKey="stock"
                        name="Current Stock"
                        radius={[
                            0,
                            4,
                            4,
                            0
                        ]}
                    />

                    {/* 
                     * Reorder threshold.
                     *
                     * This gives management a visual
                     * indication of how far below the
                     * required stock level the product is.
                     */}
                    <Bar
                        dataKey="reorderLevel"
                        name="Reorder Level"
                        radius={[
                            0,
                            4,
                            4,
                            0
                        ]}
                    />

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RestockChart;