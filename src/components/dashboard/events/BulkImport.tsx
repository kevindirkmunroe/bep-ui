import React, { useMemo, useState } from "react";
import Modal from "../../Modal";
import {BulkImportManager, BulkImportResult} from "./BulkImportManager";
import {MappedEvent} from "../../../utils/googleSheetsMapper";
import LoadingSpinner from "../../LoadingSpinner";

interface BulkImportProps {
    userId: string;
    events: MappedEvent[];
    source: string;
    previousBulkImportResult: BulkImportResult;
    onClose: () => void;
    onImportComplete?: (imported: MappedEvent[], bulkImportResult: BulkImportResult) => void;
}

interface EditableRow {
    id: number;
    selected: boolean;
    event: MappedEvent;
}

function generateSyncKey(userId: string, name: string, title: string, start_datetime: string) {
    const input = `${userId}-${name}-${title}-${start_datetime}`;

    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }

    // Convert unsigned 32-bit integer to compact base-36 string
    return (hash >>> 0).toString(36);
}

export default function BulkImport({
                                       userId,
                                       events,
                                       source,
                                       previousBulkImportResult,
                                       onClose,
                                       onImportComplete
                                   }: BulkImportProps) {

    const duplicateKeys = previousBulkImportResult?.duplicates?.map((event) => generateSyncKey(userId, event.name, event.title, event.start_datetime)) || [];
    const filterUniqueEvents = (events, duplicateKeys: string[]) => {
        return events.filter((e) => !duplicateKeys.includes(generateSyncKey(e.title, e.start_datetime)));
    }

    const [rows, setRows] = useState<EditableRow[]>(() =>
        filterUniqueEvents(events, duplicateKeys).map((event, index) => ({
            id: index,
            selected: true,
            event: { ...event }
        }))
    );

    const [importing, setImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bulkImportManager = useMemo(
        () => new BulkImportManager(),
        []
    );

    // Build columns from all event fields, not just the first event.
    const columns = useMemo(() => {
        const fields = new Set<string>();

        events.forEach(event => {
            Object.keys(event).forEach(key => {
                if (key !== "image" && key !== "image_url") {
                    fields.add(key);
                }
            });
        });

        return Array.from(fields);
    }, [events]);

    const selectedCount = rows.filter(row => row.selected).length;

    const updateField = (
        id: number,
        field: string,
        value: string
    ) => {
        setRows(previous =>
            previous.map(row =>
                row.id === id
                    ? {
                        ...row,
                        event: {
                            ...row.event,
                            [field]: value
                        }
                    }
                    : row
            )
        );
    };

    const toggleRow = (id: number, checked: boolean) => {
        setRows(previous =>
            previous.map(row =>
                row.id === id
                    ? { ...row, selected: checked }
                    : row
            )
        );
    };

    const toggleAll = (checked: boolean) => {
        setRows(previous =>
            previous.map(row => ({
                ...row,
                selected: checked
            }))
        );
    };

    const handleImportSelected = async () => {
        const selectedEvents = rows
            .filter(row => row.selected)
            .map(row => ({ ...row.event }));

        if (selectedEvents.length === 0) return;

        setImporting(true);
        setError(null);

        try {
            const bulkImportResult = await bulkImportManager.importEvents(userId, source, selectedEvents);
            // TODO: use this list for bulk activate

            onImportComplete?.(selectedEvents, bulkImportResult);
            onClose();

        } catch (err) {
            console.error("Bulk import failed:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Bulk import failed."
            );
        } finally {
            setImporting(false);
        }
    };

    return (
        <Modal
            onClose={() => {
                if (!importing) onClose();
            }}
            style={{ width: "95%", zIndex: 1300, maxWidth: "1600px" }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxHeight: "85vh"
            }}>
                <h2>Bulk Import Events</h2>
                <div>
                    {rows? rows.length : events.length} events loaded.
                    {" "}
                    <strong>{selectedCount} selected for import.</strong>
                </div>
                {importing && (
                    <div>
                        <LoadingSpinner message={`Bulk Importing ${selectedCount} Events, please wait...`} />
                    </div>
                )}
                <div style={{
                    overflow: "auto",
                    flex: 1,
                    minHeight: 0,
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <table style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        fontSize: "13px"
                    }}>
                        <thead>
                        <tr>
                            <th>Image</th>
                            {columns.map(column => (
                                <th
                                    key={column}
                                    style={headerStyle}
                                >
                                    {column}
                                </th>
                            ))}

                            <th style={headerStyle}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            rows.length > 0 &&
                                            rows.every(row => row.selected)
                                        }
                                        onChange={e =>
                                            toggleAll(e.target.checked)
                                        }
                                        disabled={importing}
                                    />
                                    {" "}Import
                                </label>
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows.map(row => (
                            <tr key={row.id}>
                                <td>
                                    { row.event.image ? (
                                        <img src={row.event.image} alt="Image" style={{
                                            width: "60px",
                                            height: "32px",
                                            padding: "8px",
                                            marginLeft: "20px",
                                            marginRight: "4px",
                                            borderRadius: "6px",
                                            objectFit: "cover" }} />
                                    ) : (
                                        <img src={"/icons8-image-64.png"} alt="No Image" style={{
                                            width: "32px",
                                            height: "28px",
                                            marginLeft: "8px",
                                            borderRadius: "6px",
                                            objectFit: "contain" }} />
                                    )
                                    }
                                </td>
                                {columns.map(column => (
                                    <td
                                        key={column}
                                        style={cellStyle}
                                    >
                                        <input
                                            type="text"
                                            value={
                                                row.event[column] ?? ""
                                            }
                                            onChange={e =>
                                                updateField(
                                                    row.id,
                                                    column,
                                                    e.target.value
                                                )
                                            }
                                            disabled={importing}
                                            style={{
                                                width: "180px",
                                                padding: "5px",
                                                boxSizing: "border-box"
                                            }}
                                        />
                                    </td>
                                ))}

                                <td style={{
                                    ...cellStyle,
                                    textAlign: "center"
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={row.selected}
                                        onChange={e =>
                                            toggleRow(
                                                row.id,
                                                e.target.checked
                                            )
                                        }
                                        disabled={importing}
                                        aria-label={`Import row ${row.id + 1}`}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {error && (
                    <div style={{ color: "red" }}>
                        {error}
                    </div>
                )}

                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    paddingTop: "10px",
                    borderTop: "1px solid #ddd"
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={importing}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleImportSelected}
                        disabled={
                            importing || selectedCount === 0
                        }
                    >
                        {importing
                            ? "Importing..."
                            : `Import Selected (${selectedCount})`
                        }
                    </button>
                </div>
            </div>
        </Modal>
    );
}

const headerStyle: React.CSSProperties = {
    padding: "8px",
    borderBottom: "2px solid #ccc",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    position: "sticky",
    top: 0,
    zIndex: 1,
    whiteSpace: "nowrap"
};

const cellStyle: React.CSSProperties = {
    padding: "5px",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap"
};
