import { useState } from "react";

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

    const handleRecycle = async () => {
        if (newDate < today) {
            alert("Please choose today or a future date.");
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
            <div style={modalStyle}>
                <h2>Recycle Event</h2>
                <h4>{name}</h4>
                <p>
                    Choose a new event date. The event will move back to Active.
                </p>

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
