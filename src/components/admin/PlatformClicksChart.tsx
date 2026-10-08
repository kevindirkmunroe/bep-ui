import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from "recharts";

interface PlatformClicks {
    platform: string;
    click_count: number;
    click_percentage: number;
}

const platformNames: Record<string, string> = {
    funcheapsf: "Funcheap SF",
    dothebay: "DoTheBay",
    sfweekly: "SF Weekly",
    sfstation: "SF Station",
    visitoakland: "Visit Oakland",
    indybay: "IndyBay"
};

export default function PlatformClicksChart({title, userId, window}) {
    const [data, setData] = useState<PlatformClicks[]>([]);
    const [loading, setLoading] = useState(true);

    let endpoint = `/admin/analytics/platform-clicks` + (userId? `/${userId}` : '');
    endpoint = endpoint + (window? "?window=30" : "");

    console.log(`[PlatformClicksChart] endpoint: ${endpoint}`);
    useEffect(() => {
        fetch(endpoint)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to load platform clicks");
                }

                return res.json();
            })
            .then(rows => {
                setData(
                    rows.map((row: PlatformClicks) => ({
                        ...row,
                        click_count: Number(row.click_count),
                        click_percentage: Number(row.click_percentage)
                    }))
                );
            })
            .catch(err => {
                console.error("Error loading platform clicks:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading click data...</div>;
    }

    if (data.length === 0) {
        return <div>No click data yet.</div>;
    }

    return (
        <div className="platform-clicks-chart">
            <h3>{title}</h3>

            <ResponsiveContainer
                width="100%"
                height={Math.max(250, data.length * 48)}
            >
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 90,
                        bottom: 10,
                        left: 20
                    }}
                >
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                    />

                    <YAxis
                        type="category"
                        dataKey="platform"
                        width={110}
                        tickFormatter={(platform) =>
                            platformNames[platform] ?? platform
                        }
                    />

                    <Tooltip
                        formatter={(value, _name, props) => [
                            `${props.payload.click_count} clicks (${value}%)`,
                            "Click Share"
                        ]}
                    />

                    <Bar
                        dataKey="click_percentage"
                        name="Click Share"
                    >
                        <LabelList
                            dataKey="click_count"
                            position="right"
                            formatter={(value: number) =>
                                `${value} click${value === 1 ? "" : "s"}`
                            }
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
