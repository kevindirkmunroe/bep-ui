import React, { useState } from "react";
import BaseDialog, {DialogState} from "../../BaseDialog";

interface RecycleEventModalProps {
    name: string;
    onCancel: () => void;
    onRecycle: (newDate: string) => Promise<void>;
}

function getTodayDateString() {
    return new Date().toISOString().split("T")[0];
}

export default function RecycleEventModal({
                                              name,
                                              onCancel,
                                              onRecycle,
                                          }: RecycleEventModalProps) {
    const today = getTodayDateString();
    const [newDate, setNewDate] = useState(today);
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState<DialogState>(null);

    const handleRecycle = async () => {
        if (newDate < today) {
            setDialog({
                type: "error",
                title: "Recycle Event",
                message: "Please choose today or a future date."
            });
            return;
        }

        setLoading(true);

        try {
            await onRecycle(newDate);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlayStyle}>
            {dialog && (
                <BaseDialog
                    type={dialog.type}
                    title={dialog.title}
                    message={dialog.message}
                    confirmLabel={dialog.confirmLabel}
                    onConfirm={dialog.onConfirm}
                    onClose={() => setDialog(null)}
                />
            )}
            <div style={modalStyle}>
                <div style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'center', /* Centers items horizontally */
                    alignItems: 'center'
                }}>
                    <img src={"/icons8-recycle-32-black.png"} style={{width: "24px", height: "24px", marginBottom: "6px", marginRight: "8px"}}/>
                    <h2>Recycle Event</h2>
                </div>
                <h4>{name}</h4>
                <p>
                    Copy this event with a new start date. Copied event will be Active.
                </p>
                <br/>

                <input
                    type="date"
                    value={newDate}
                    min={today}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={inputStyle}
                />

                <div style={buttonRowStyle}>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleRecycle}
                        disabled={loading}
                    >
                        {loading ? "Recycling..." : "Recycle"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modalStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    width: "400px",
    maxWidth: "90vw",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
};

const buttonRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px"
};
