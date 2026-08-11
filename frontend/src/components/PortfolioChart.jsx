import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const PortfolioChart = ({ data = [] }) => {

    const chartData = data
        .map((item) => ({

            name:
                item.category ??
                item.name ??
                item._id ??
                "Other",

            value: Number(
                item.value ??
                item.totalValue ??
                item.inventoryValue ??
                item.totalInventoryValue ??
                item.valuation ??
                item.totalValuation ??
                0
            )

        }))
        .filter(
            (item) => item.value > 0
        );

    return (
        <div className="chart-container">

            {chartData.length === 0 ? (

                <div className="chart-empty">
                    No portfolio valuation
                    data available.
                </div>

            ) : (

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={90}
                            innerRadius={45}
                            paddingAngle={3}
                        >

                            {chartData.map(
                                (_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                    />
                                )
                            )}

                        </Pie>

                        <Tooltip
                            formatter={(value) =>
                                `$${Number(
                                    value
                                ).toLocaleString()}`
                            }
                        />

                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{
                                fontSize: "10px"
                            }}
                        />

                    </PieChart>

                </ResponsiveContainer>

            )}

        </div>
    );
};

export default PortfolioChart;