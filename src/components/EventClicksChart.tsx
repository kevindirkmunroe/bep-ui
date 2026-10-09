
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
} from "recharts";

interface EventClick {
    event_id: string;
    title: string;
    event_date: string;
    clicks: number;
}

interface EventClicksChartProps {
    user_id?: string;
}

interface ChartRow extends EventClick {
    label: string;
}

const formatEventDate = (date: string): string => {
    // Parse YYYY-MM-DD as a local calendar date
    // to avoid timezone-related date shifts.
    const [year, month, day] = date.slice(0, 10)
        .split("-")
        .map(Number);

    return new Date(year, month - 1, day).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
};

const truncateLabel = (label: string, max = 32) =>
    label.length > max
        ? `${label.slice(0, max - 1)}…`
        : label;

export default function EventClicksChart({
                                             user_id
                                         }: EventClicksChartProps) {
    const [data, setData] = useState<ChartRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchEventClicks() {
            setLoading(true);
            setError(null);
            setData([]);

            try {
                const url = user_id
                    ? `/admin/analytics/event-clicks/${encodeURIComponent(user_id)}`
                    : "/admin/analytics/event-clicks";

                const response = await fetch(url, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to load event clicks (${response.status})`
                    );
                }

                const events: EventClick[] = await response.json();

                const chartData = events
                    .map(event => ({
                        ...event,
                        clicks: Number(event.clicks),
                        label: `${event.title} · ${formatEventDate(
                            event.event_date
                        )}`
                    }))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 10);

                if (!controller.signal.aborted) {
                    setData(chartData);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load event clicks"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchEventClicks();

        return () => controller.abort();
    }, [user_id]);

    if (loading) {
        return <p>Loading event clicks...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (data.length === 0) {
        return <p>No event clicks recorded yet.</p>;
    }

    return (
        <div style={{ width: "100%" }}>
            <h3>Most Popular Events by Clicks</h3>

            <ResponsiveContainer
                width="100%"
                height={Math.max(280, data.length * 52 + 60)}
            >
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 10,
                        right: 40,
                        bottom: 10,
                        left: 10
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                    />

                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="label"
                        width={230}
                        tick={{
                            fontSize: 12
                        }}
                        tickFormatter={value =>
                            truncateLabel(String(value))
                        }
                        interval={0}
                    />

                    <Tooltip
                        formatter={value => [
                            Number(value).toLocaleString(),
                            "Clicks"
                        ]}
                        labelFormatter={label => String(label)}
                    />

                    <Bar
                        dataKey="clicks"
                        name="Clicks"
                        fill="#D2492C"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={28}
                    >
                        {data.map(event => (
                            <Cell
                                key={event.event_id}
                                fill="#D2492C"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
