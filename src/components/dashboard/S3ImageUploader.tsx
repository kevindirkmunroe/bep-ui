import React, { useState } from 'react';
import axios from 'axios';
import {api} from "../../utils/api";

export default function S3ImageUploader() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Enforce the 2MB limit on the client side before triggering an upload
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit.');
                return;
            }

            setFile(selectedFile);

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert('Please select a file first.');

        setUploading(true);

        try {
            // Step 1: Request the presigned URL from your backend API
            const backendResponse = await api.post(`/events/upload-url`, {
                filename: file.name,
                contentType: file.type,
            });

            const { url, key } = backendResponse.data;

            if (!url) throw new Error('Failed to get presigned URL from backend');
            console.log(`[S3ImageUploader] got presigned url ${url}`);

            // Step 2: Upload the raw binary file directly to S3 using Axios
            // CRITICAL: Pass the 'file' object directly as the body argument. Do not wrap it in FormData.
            const s3Response = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type, // Must exactly match the backend's presigned signature
                },
            });

            if (s3Response.status === 200) {
                alert('Image uploaded successfully!');
                const s3Prefix = import.meta.env.VITE_AWS_S3_IMAGES_PREFIX;
                setImageUrl(`${s3Prefix}/${key}`);
                console.log(`[S3ImageUploader] Successful upload to S3, uploaded=${s3Prefix}/${key}`);

            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("[S3ImageUploader] S3 ERROR");
                console.error("status:", err.response?.status);
                console.error("data:", err.response?.data);
                console.error("headers:", err.response?.headers);
            } else {
                console.error(err);
            }
            alert(error.response?.data?.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button onClick={handleUpload} disabled={uploading || !file} style={{ marginLeft: '10px' }}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {file && <p style={{ fontSize: '12px', color: '#666' }}>Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(10)} MB)</p>}
            {previewUrl && (
                <div style={{ marginTop: '20px' }}>
                    <p>Image Preview:</p>
                    <img src={previewUrl} alt="Preview" style={{
                        maxWidth: "240px",
                        maxHeight: "180px",
                        objectFit: "contain"  }} />
                </div>
            )}
            {imageUrl && (
                <div style={{ marginTop: '20px' }}>
                    <p>Uploaded Image Upload:</p>
                    <img src={imageUrl} alt="Uploaded" style={{
                        maxWidth: "240px",
                        maxHeight: "180px",
                        objectFit: "contain" }} />
                </div>
            )}
        </div>
    );
}
