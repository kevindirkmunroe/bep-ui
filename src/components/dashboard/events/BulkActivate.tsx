import React, {useEffect, useState} from "react";
import Modal from "../../Modal";
import LoadingSpinner from "../../LoadingSpinner";
import {MappedEvent} from "../../../utils/googleSheetsMapper";
import {BulkImportResult} from "./BulkImportManager";

interface BulkActivateProps {
    size: number;
    onClose: () => void;
}

export function BulkActivate({size, onClose} : BulkActivateProps) {

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
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
