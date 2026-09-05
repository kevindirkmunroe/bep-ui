import { useRef, useState } from "react";
import { api } from "../../utils/api";

interface ImageUploadProps {
    onUploaded: (imageUrl: string) => void;
}

export default function ImageUpload({
                                        onUploaded
                                    }: ImageUploadProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const onChooseFile = () => {
        fileInputRef.current?.click();
    };

    const onFileSelected = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setError(null);

        // Basic browser-side validation
        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file.");
            e.target.value = "";
            return;
        }

        // Optional size limit: 10 MB
        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            setError("Image must be smaller than 10 MB.");
            e.target.value = "";
            return;
        }

        const formData = new FormData();

        formData.append("imageUrl", file);

        try {

            setUploading(true);

            const response = await api.post<{ imageUrl: string; }>(
                `/events/image`,
                formData
            );

            setImageUrl(response.data.imageUrl);

            onUploaded(response.data.imageUrl);

        } catch (err) {

            console.error(err);
            setError("Image upload failed.");

        } finally {

            setUploading(false);

            // lets user choose same file again if needed
            e.target.value = "";
        }
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileSelected}
            />

            <button
                type="button"
                onClick={onChooseFile}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload Image"}
            </button>

            {error && (
                <div style={{ color: "red", marginTop: "8px" }}>
                    {error}
                </div>
            )}

            {imageUrl && (
                <div style={{ marginTop: "12px" }}>
                    <img
                        src={imageUrl}
                        alt="Uploaded event"
                        style={{
                            maxWidth: "240px",
                            maxHeight: "180px",
                            objectFit: "contain"
                        }}
                    />
                </div>
            )}
        </div>
    );
}
