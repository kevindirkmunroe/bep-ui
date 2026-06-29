import { useState } from "react";

interface ImportFacebookEventFormProps {
    open: boolean;
    onClose: () => void;
    onImport: (facebookEventUrl: string) => Promise<void>;
}

export default function ImportFacebookEventForm({
                                                    open,
                                                    onClose,
                                                    onImport,
                                                }: ImportFacebookEventFormProps) {
    const [facebookEventUrl, setFacebookEventUrl] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleImport = async () => {
        if (!facebookEventUrl.trim()) return;

        try {
            setLoading(true);
            await onImport(facebookEventUrl.trim());
            setFacebookEventUrl("");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Import Facebook Event</h2>

                <p style={{ marginBottom: "16px" }}>
                    Paste the URL of your Facebook Event and LocalBuzz will import the
                    available event details.
                </p>

                <label htmlFor="facebook-url">
                    Facebook Event URL
                </label>

                <input
                    id="facebook-url"
                    type="url"
                    placeholder="https://www.facebook.com/events/..."
                    value={facebookEventUrl}
                    onChange={(e) => setFacebookEventUrl(e.target.value)}
                    style={{ width: "100%", marginTop: "8px", marginBottom: "20px" }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                    }}
                >
                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        onClick={handleImport}
                        disabled={loading || !facebookEventUrl.trim()}
                    >
                        {loading ? "Importing..." : "Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}
