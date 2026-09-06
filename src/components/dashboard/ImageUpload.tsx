import {useRef, useState} from "react";
import { api } from "../../utils/api";

interface ImageUploadProps {
    currImage: string;
    currImageTitle: string;
    onUploaded: (image: string) => void;
}

export default function ImageUpload({   currImage,
                                        currImageTitle,
                                        onUploaded
                                    }: ImageUploadProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(currImage);
    const [imageTitle, setImageTitle] = useState<string | null>(currImageTitle);

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

        setImageTitle(file.name);
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
        formData.append("image", file);

        try {
            setUploading(true);
            const response = await api.post<{ image: string; }>(
                `/events/image`,
                formData
            );

            setImage(response.data.image);
            onUploaded(response.data.image);

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
        <div style={{display: "flex 0 1", width: "100%", alignItems: "flex-start"}}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileSelected}
            />

            <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start"}}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onChooseFile}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload Image"}
                </button>
            </div>
            {error && (
                <div style={{ color: "red", marginTop: "8px" }}>
                    {error}
                </div>
            )}

            {image && (
                <div style={{ marginTop: "12px" }}>
                    <img
                        src={image}
                        alt="Uploaded event"
                        style={{
                            maxWidth: "240px",
                            maxHeight: "180px",
                            objectFit: "contain"
                        }}
                    />
                    <p style={{fontSize: "14px"}}>{imageTitle}</p>
                </div>
            )}
        </div>
    );
}
