
import React, { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api"; // Adjust to your existing api path

interface BulkImportHistoryItem {
    bulk_insert_id: string;
    created_at: string;
    deleted_at: string | null;
    event_count: number;
    source: string | null;
}

export default function BulkImportHistory({userId}) {
    const [history, setHistory] = useState<BulkImportHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [sortDirection, setSortDirection] =
        useState<"asc" | "desc">("desc");

    const loadHistory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // throw new Error('not ready yet!');
            const response = await api.get<BulkImportHistoryItem[]>(
                `/users/${userId}/events/bulk`
            );

            setHistory(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load bulk import history.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadHistory();
    }, [loadHistory]);

    const handleDelete = async (bulkInsertId: string) => {
        if (!window.confirm(
            "Delete this bulk import? This will mark the batch as deleted."
        )) {
            return;
        }

        try {
            setDeletingId(bulkInsertId);
            setError(null);

            const response = await api.delete<{
                bulk_insert_id: string;
                deleted_at: string;
            }>(`/users/${userId}/events/bulk/${bulkInsertId}/`);

            setHistory(previous =>
                previous.map(item =>
                    item.bulk_insert_id === bulkInsertId
                        ? {
                            ...item,
                            deleted_at: response.data.deleted_at
                        }
                        : item
                )
            );
        } catch (err) {
            console.error(err);
            setError("Unable to delete bulk import.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (value: string) =>
        new Date(value).toLocaleString();

    if (loading) {
        return <div>Loading bulk import history...</div>;
    }

    const sortedHistory = [...history].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();

        return sortDirection === "asc"
            ? dateA - dateB
            : dateB - dateA;
    });

    return (
        <div className="bulk-import-history">
            <h3 style={{backgroundColor: "#E5E5E5", alignItems: "left"}}>{`Bulk Import History (${history?.length})`}</h3>

            {error && (
                <div role="alert" style={{ color: "red" }}>
                    {error}
                </div>
            )}

            <div style={{
                height: "600px",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "auto",
                position: "relative"
            }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        textAlign: "left"
                    }}
                >
                    <thead>
                    <tr>
                        <th
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f5f5f5",
                                padding: "12px",
                                borderBottom: "2px solid #ddd",
                                textAlign: "left"
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setSortDirection(prev =>
                                        prev === "asc" ? "desc" : "asc"
                                    )
                                }
                                style={{
                                    background: "none",
                                    fontSize: "16px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    padding: 0
                                }}
                                title="Sort by creation date"
                            >
                                Created At {sortDirection === "asc" ? "▲" : "▼"}
                            </button>
                        </th>

                        {["ID", "Count", "Source", "Delete"].map(header => (
                            <th
                                key={header}
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f5f5f5",
                                    padding: "12px",
                                    borderBottom: "2px solid #ddd",
                                    textAlign: "left"
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {history.length === 0 ? (
                        <tr>
                            <td colSpan={4}>
                                No bulk imports found.
                            </td>
                        </tr>
                    ) : (
                        sortedHistory.map(item => (
                            <tr key={item.bulk_insert_id}>
                                <td>{new Date(item.created_at).toLocaleString()}</td>
                                <td title={item.bulk_insert_id}>
                                    {item.bulk_insert_id}
                                </td>

                                <td>{item.event_count}</td>

                                <td>
                                    {item.source ? (
                                        <a
                                            href={item.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {item.source}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </td>

                                <td>
                                    {item.deleted_at ? (
                                        <span title="Deleted at">
                                                {formatDate(item.deleted_at)}
                                            </span>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={
                                                deletingId ===
                                                item.bulk_insert_id
                                            }
                                            onClick={() =>
                                                void handleDelete(
                                                    item.bulk_insert_id
                                                )
                                            }
                                        >
                                            {deletingId ===
                                            item.bulk_insert_id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
