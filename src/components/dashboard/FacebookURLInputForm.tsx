import { useState } from "react";

interface ImportFacebookEventFormProps {
    open: boolean;
    onClose: () => void;
    onImport: (facebookEventUrl: string) => Promise<void>;
}

export default function FacebookURLInputForm({
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
                <svg xmlns="http://w3.org" viewBox="0 0 512 512" width="28px" height="28px">
                    <path
                        d="M504 256C504 114.6 393.4 4 256 4S4 114.6 4 256c0 127 92.6 232.6 214 251V332h-62v-76h62v-54c0-61.2 36-95 119.5-95 34.6 0 71.7 6.1 71.7 6.1v79h-40.4c-30.4 0-39.9 18.9-39.9 38.2v56h78.3l-12.5 76H351v175c121.4-18.4 214-124 214-251z"
                        fill="#000000"/>
                </svg>
                <h2>Import Facebook Event</h2>

                <p style={{marginBottom: "16px"}}>
                    Copy the URL of your Facebook Event and LocalBuzz will import the
                    available event details
                </p>

                <input
                    id="facebook-url"
                    type="url"
                    placeholder="https://www.facebook.com/events/..."
                    value={facebookEventUrl}
                    onChange={(e) => setFacebookEventUrl(e.target.value)}
                    style={{width: "100%", marginTop: "8px", marginBottom: "20px"}}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                    }}
                >
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="btn btn-primary-greater"
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
