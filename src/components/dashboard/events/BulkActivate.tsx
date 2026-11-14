import React, {useEffect, useState} from "react";
import LoadingSpinner from "../../LoadingSpinner";
import {BulkImportResult, BulkInsertEventItem} from "./BulkImportManager";
import {api} from "../../../utils/api";
import {ServiceSelectionStatus} from "./payments/ServiceSelectionPage";

interface BulkActivateProps {
    events: BulkInsertEventItem[];
    onClose: () => void;
}

export function BulkActivate({events, onClose} : BulkActivateProps) {
    const size = events.length;
    const [loading, setLoading] = useState<boolean>(true);

    const doBulkActivate = async () => {
        setLoading(true);


        // get array of event keys...
        const eventDetails = events.flatMap(item =>
            Object.entries(item).map(([eventId, event]) => ({
                ...event,
                event_id: eventId
            }))
        );

        // PRO only for now...
        const promote_selection = ServiceSelectionStatus.PRO;
        const response = await api.post<BulkImportResult>(
            `/orders/bulk`,
            { promote_selection, events: eventDetails }
        );
        setLoading(false);
    }

    useEffect( () => {
        doBulkActivate();
    }, []);


    return (
        <div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxHeight: "85vh",
                margin: "10px"
            }}>
                <h2 style={{color: "white", backgroundColor: "#D2492C"}}> <img src={"/icons8-lightning-64-white.png"} style={{width: "24px", height: "24px"}}/>Bulk Activate Events</h2>
                {loading ? (
                    <LoadingSpinner message={`Please wait, Activating ${size} Event${size > 1? 's': ''}...`} />
                ) : (
                    <strong>{`${size } Event${size > 1? 's': ''} Activated successfully!`}</strong>
                )}
            </div>
            <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
            >
                Done
            </button>
        </div>
    );
}
