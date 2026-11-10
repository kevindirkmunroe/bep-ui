import React, {useEffect, useState} from "react";
import {GoogleSheetsData, mapGoogleSheetEvents, MappedEvent} from "../../../utils/googleSheetsMapper";
import "./googleSheets.css";
import Modal from "../../Modal";
import ImportFacebookEventForm from "../ImportGoogleSheetsEventForm";

interface ImportGoogleSheetsFormProps {
    open: boolean;
    userId:  string;
    onClose: () => void;
    readGoogleSheet: (googleSheetsUrl: string) => Promise<GoogleSheetsData>;
}

export default function GoogleSheetsURLInputForm({
                                                     open,
                                                     userId,
                                                     onClose,
                                                     readGoogleSheet,
                                               }: ImportGoogleSheetsFormProps) {
    const [lastUrl, setLastUrl] = useState("");
    const [googleSheetsUrl, setGoogleSheetsUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [checkingGoogleAuth, setCheckingGoogleAuth] = useState(true);

    const [sheetData, setSheetData] =
        useState<GoogleSheetsData | null>(null);
    const [readingSheet, setReadingSheet] = useState(false);
    const [sheetError, setSheetError] = useState<string | null>(null);
    const [mappedEvents, setMappedEvents] = useState<MappedEvent[]>([]);
    const [savedEvents, setSavedEvents] = useState<MappedEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<MappedEvent | null>(null);
    const [showMappedEventsList, setShowMappedEventsList] = useState(false);
    const API_BASE_URL= import.meta.env.VITE_GOOGLE_SHEETS_AUTH_BASE_URL;

    if (!open) return null;

    const markSelectedEventAdded = () => {
        if(selectedEvent) {
            setSavedEvents([...savedEvents, selectedEvent]);
        }
    }

    const isSavedEvent = (event: MappedEvent) => {
        return savedEvents.includes(event);
    }

    const handleReadSheet = async () => {
        setReadingSheet(true);
        setSheetError(null);

        try {
            const data = await readGoogleSheet(googleSheetsUrl);

            setSheetData(data);
            const events = mapGoogleSheetEvents(data);
            setMappedEvents(events);

            console.log("Mapped events:", JSON.stringify(events));

        } catch (err) {
            setSheetError(
                err instanceof Error
                    ? err.message
                    : "Unable to read spreadsheet"
            );

            if(sheetError?.includes('expired')){
                setGoogleConnected(false);
            }
        } finally {
            setReadingSheet(false);
        }
    };

    const handleGoogleAuth = () => {
        const returnTo =
            window.location.pathname +
            window.location.search;

        const params = new URLSearchParams({ returnTo });

        window.location.href =
            `${API_BASE_URL}/api/google/auth?${params}`;
    };

    useEffect(() => {
        const controller = new AbortController();

        const checkGoogleAuth = async () => {
            setCheckingGoogleAuth(true);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/google/status`,
                    {
                        credentials: "include",
                        signal: controller.signal
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to check Google authorization");
                }

                const { connected } = await response.json();
                console.log(`[GoogleSheetsURLInputForm] connected=${JSON.stringify(connected)}`);
                setGoogleConnected(connected);

            } catch (err) {
                if (controller.signal.aborted) return;

                console.error("Google auth check failed:", err);
                setGoogleConnected(false);

            } finally {
                if (!controller.signal.aborted) {
                    setCheckingGoogleAuth(false);
                }
            }
        };

        void checkGoogleAuth();

        return () => controller.abort();

    }, []);

    const formatDateTime = (value: string) => {
        return new Date(value).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const handleImport = async () => {
        if (!googleSheetsUrl.trim()) return;

        setMappedEvents([]);
        try {
            setLoading(true);
            await handleReadSheet();
            setLastUrl(googleSheetsUrl);
            setGoogleSheetsUrl("");
            // onClose();
            setShowMappedEventsList(true);
        } finally {
            setLoading(false);
        }
    };

    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <div className="modal-overlay">
            <div className="modal">
                {showEditModal && (
                    <Modal style={{zIndex: 1200}} onClose={() => setShowEditModal(false)}>
                        <ImportFacebookEventForm
                            userId={userId}
                            event={selectedEvent}
                            onSuccess={() => {
                                setShowEditModal(false);
                                markSelectedEventAdded();
                            }}
                            onCancel={() => {
                                setShowEditModal(false);
                            }}
                        />
                    </Modal>
                )}
                <img src={'/google-sheets.png'} style={{ height: "34px", transform: "scale(0.85)", filter: "grayscale(100%)",}}/>
                <h2>Import Google Sheets Events</h2>
                <div style={{backgroundColor: "#d3d3d3", borderRadius: "8px", marginTop: "20px"}}>
                    <p style={{fontSize: "14px"}}>{ googleConnected ?"🟢  Google Account Connected": '🔒 Connect your Google account to read your spreadsheets'}</p>
                    <button className="btn btn-primary"
                            onClick={handleGoogleAuth}
                            style={{fontSize: "16px", padding: "4px", marginBottom: "20px", marginTop: "15px", justifyContent: "center", textAlign: "center", width: "80%", backgroundColor: "black"}}>
                        {googleConnected ? 'Refresh ' : 'Connect '} Google Account
                    </button>
                </div>
                <br/>

                <p style={{marginBottom: "8px"}}>
                    Paste your Google Sheets URL to import event details:
                </p>

                <input
                    id="google-sheets-url"
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/..."
                    value={googleSheetsUrl}
                    onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                    style={{width: "80%", marginTop: "4px", marginBottom: "20px", marginRight:"8px"}}
                />

                <button className="btn btn-primary-greater"
                        onClick={handleImport}
                        disabled={loading || !googleSheetsUrl.trim() || !googleConnected}
                >
                    {loading ? "Importing..." : "Import"}
                </button>
                {
                    showMappedEventsList && mappedEvents?.length > 0 && (
                        <div className="modal">
                            <strong style={{fontWeight: "bolder"}}>Imported Events ({savedEvents.length}/{mappedEvents.length})</strong>
                            <div style={{fontSize: "12px"}}>{lastUrl}</div>
                            <div className="parent">
                                <div className="scrollable-div">
                                    {mappedEvents.map((event, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "12px",
                                                borderBottom: "1px solid #ddd"
                                            }}
                                        >
                                            <div>
                                                <strong>{event.title}</strong>
                                                <div>{formatDateTime(event.start_datetime)}</div>
                                                <div>{event.location_name}</div>
                                            </div>

                                            <button className="btn btn btn-secondary"
                                                    disabled={isSavedEvent(event)}
                                                    style={{height: "34px"}}
                                                    onClick={() => {
                                                setSelectedEvent(event)
                                                setShowEditModal(true);
                                                }
                                            }>
                                                <img src={"/icons8-edit-64.png"} style={{width: "24px", height: "24px"}}/> Edit
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {sheetError && (
                    <div style={{color: "red"}}>{sheetError}</div>
                )}
                <div
                    style={{
                        display: "flex",
                        marginTop: "20px",
                        justifyContent: "flex-end",
                        gap: "12px",
                    }}
                >
                    {mappedEvents.length > 0 && (
                        <button className="btn btn-secondary" onClick={() => {
                            setMappedEvents([]);
                            setLastUrl("")}}
                        >
                            Clear Imported Events
                        </button>
                        )
                    }

                    <button className="btn btn-secondary" onClick={onClose}>
                        Done
                    </button>

                </div>
            </div>
        </div>
    );
}
