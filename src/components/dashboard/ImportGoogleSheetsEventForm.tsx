import React, {useEffect, useState} from "react";
import {api} from "../../utils/api";
import {categories} from "./EventCategories";
import {ImportGoogleSheetsEventFormProps} from "./eventTypes.interface";
import BaseDialog, {DialogState} from "../BaseDialog";
import {formatDateTimeLocal, isOlderThanToday} from "../../utils/DateTime";
import S3ImageUploader from "./S3ImageUploader";
import {getZipFromAddress} from "./AddressUtils";
import {MappedEvent} from "../../utils/googleSheetsMapper";

export default function ImportFacebookEventForm({
                                                    userId,
                                                    event,
                                                    onSuccess,
                                                    onCancel,
                                                }: ImportGoogleSheetsEventFormProps) {

    const buildForm = (event?: MappedEvent) => ({
        name: event?.name || "",
        email: event?.email || "",
        title: event?.title || "",
        description: event?.description || "",
        start_datetime: formatDateTimeLocal(event?.start_datetime) || "",
        location_name: event?.location_name || "",
        address: event?.address || "",
        zip: event?.zip || getZipFromAddress(event?.address),
        price: event?.price || "",
        organization: event?.organization || "",
        phone: event?.phone || "",
        image: event?.image || "",
        website: event?.website || "",
        imported_from: event?.imported_from || "",
        category: event?.category || "",
    });

    const [form, setForm] = useState(buildForm(event));
    useEffect(() => {
        setForm(buildForm(event));
    }, [event]);
    const [dialog, setDialog] = useState<DialogState>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUploaded = (newImageUrl: string) => {
        setForm({
            ...form,
            image: newImageUrl
        })
    }

    const handleSubmit = async () => {
        if(!form.image){
            setDialog({
                type: "error",
                title: "Import Google Sheets",
                message: "Please Upload an Event Cover Image to Continue."
            });
            return;
        }
        if(isOlderThanToday(form.start_datetime)){
            setDialog({
                type: "error",
                title: "Import Google Sheets",
                message: "Please Select a start date older than today to Continue."
            });
            return;
        }
        try {
            await api.post(`/users/${userId}/events`, form);
            onSuccess(); // reload events
        } catch (err) {
            console.error(err);
            setDialog({
                type: "error",
                title: "Import Google Sheets",
                message: "Failed to create event"
            });
        }
    };

    return (
        <div style={{marginBottom: 20, display: "flex", flexDirection: "column"}}>

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
            <div style={{flexDirection: 'row'}}>
                <svg width="28px" height="28px" fill="none" viewBox="0 0 800 581.8182" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                    <path fill="#009954" d="M0 193.6364c0-40.65 0-60.9773 6.3818-77.1a90.91 90.91 0 0 1 51.0637-51.0591c16.1227-6.3864 36.4454-6.3864 77.1-6.3864H410.909c40.65 0 60.9773 0 77.1 6.3818a90.91 90.91 0 0 1 51.0636 51.0637c6.3818 16.1227 6.3818 36.4454 6.3818 77.1v194.5454c0 40.65 0 60.9773-6.3818 77.1a90.91 90.91 0 0 1-51.0636 51.0637c-16.1227 6.3818-36.45 6.3818-77.1 6.3818H134.5454c-40.65 0-60.9772 0-77.1045-6.3818a90.91 90.91 0 0 1-51.059-51.0637C0 449.1591 0 428.8318 0 388.1818Z"/>
                    <mask id="a" width="160" height="128" x="24" y="32" maskUnits="userSpaceOnUse">
                        <rect width="160" height="128" x="24" y="32" fill="#fff" rx="20"/>
                    </mask>
                    <g mask="url(#a)" transform="matrix(4.5454545,0,0,4.5454545,-36.363636,-145.45454)">
                        <path fill="#0ebc5f" d="M24 32h160v128H24Z"/>
                        <g filter="url(#b)">
                            <rect width="144" height="102" fill="url(#c)" rx="25.6" transform="matrix(1,0,0,-1,8,147)" x="0" y="0"/>
                        </g>
                    </g>
                    <path stroke="#ffffff" stroke-linecap="round" stroke-width="54.5455" d="M327.2727 404.5455H709.091m-90.909 86.3636v-290.909"/>
                    <defs>
                        <linearGradient id="c" x1="122.24" x2="20.76" y1="43.31" y2="43.31" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#0ebc5f"/>
                            <stop offset=".95" stop-color="#78c9ff"/>
                        </linearGradient>
                        <filter id="b" width="168" height="126" x="-4" y="33" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" mode="normal"/>
                            <feGaussianBlur result="effect1_foregroundBlur_37435_8174" stdDeviation="6"/>
                        </filter>
                    </defs>
                </svg>
                <h2>Import Google Sheets Event</h2>
                <h5>{event?.imported_from}</h5>
            </div>
            <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                    id="name"
                    name="name"
                    className="input"
                    placeholder="Your Name"
                    onChange={handleChange}
                    value={form.name}
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    className="input"
                    placeholder="Your Email (For Publish Updates)"
                    onChange={handleChange}
                    value={form.email}
                />

                <label htmlFor="title">Event Title</label>
                <input
                    id="title"
                    name="title"
                    className="input"
                    placeholder="Event Title"
                    onChange={handleChange}
                    value={form.title}
                />

                <label htmlFor="location_name">Location / Venue</label>
                <input
                    id="location_name"
                    name="location_name"
                    className="input"
                    placeholder="e.g. Club Deluxe, San Jose Improv"
                    onChange={handleChange}
                    value={form.location_name}
                />

                <label htmlFor="start_datetime">Start Date / Time</label>
                <input
                    id="start_datetime"
                    name="start_datetime"
                    className="input"
                    type="datetime-local"
                    onChange={handleChange}
                    value={form.start_datetime}
                >
                </input>

                {isOlderThanToday(form.start_datetime) && (
                    <>
                        <label htmlFor="start_datetime"></label>
                        <div className="field-hint">
                            Start Date must be older than today.
                        </div>
                    </>
                )}

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="input"
                    placeholder="Description"
                    onChange={handleChange}
                    value={form.description}
                />

                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={form.category || ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            category: e.target.value
                        })
                    }
                    className="input"
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <label htmlFor="address">Address</label>
                <input
                    id="address"
                    name="address"
                    className="input"
                    placeholder="Address"
                    onChange={handleChange}
                    value={form.address}
                />

                <label htmlFor="zip">Zip Code</label>
                <input
                    id="zip"
                    name="zip"
                    className="input"
                    placeholder="Zip Code"
                    onChange={handleChange}
                    value={form.zip}
                />

                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    name="price"
                    className="input"
                    placeholder="Leave blank if FREE"
                    onChange={handleChange}
                    value={form.price}
                />

                <label htmlFor="phone">Cover Photo</label>
                <S3ImageUploader currImage={form.image} onUploadSuccess={handleImageUploaded} />

                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    name="phone"
                    className="input"
                    placeholder="Phone"
                    onChange={handleChange}
                    value={form.phone}
                />

                <label htmlFor="organization">Organization</label>
                <input
                    id="organization"
                    name="organization"
                    className="input"
                    placeholder="Organization"
                    onChange={handleChange}
                    value={form.organization}
                />

                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    name="website"
                    className="input"
                    placeholder="Website"
                    onChange={handleChange}
                    value={form.website}
                />

                <label htmlFor="imported_from">Imported From</label>
                <input
                    id="imported_from"
                    name="imported_from"
                    className="input"
                    placeholder="Imported From URI"
                    onChange={handleChange}
                    value={form.imported_from}
                />
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <button className="btn btn-primary-greater" onClick={handleSubmit}>Import Event</button>
                &nbsp;
                <button className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
            </div>
        </div>
    );
}
