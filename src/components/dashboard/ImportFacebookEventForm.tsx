import React, {useEffect, useState} from "react";
import { FacebookEventDetail} from "./events/eventDetailTypes.interface";
import {api} from "../../utils/api";
import {categories} from "./EventCategories";
import {ImportFacebookEventFormProps} from "./eventTypes.interface";
import BaseDialog, {DialogState} from "../BaseDialog";
import {formatDateTimeLocal} from "../../utils/DateTime";

export default function ImportFacebookEventForm({
                                                userId,
                                                event,
                                                onSuccess,
                                                onCancel,
                                            }: ImportFacebookEventFormProps) {

    const buildForm = (event?: FacebookEventDetail) => ({
        name: event?.name || "",
        email: event?.email || "",
        title: event?.title || "",
        description: event?.description || "",
        start_datetime: formatDateTimeLocal(event?.start_datetime) || "",
        location_name: event?.location_name || "",
        address: event?.address || "",
        zip: event?.zip || "94101",
        price: event?.price || "",
        organization: event?.organization || "",
        phone: event?.phone || "",
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

    const handleSubmit = async () => {
        try {
            await api.post(`/users/${userId}/events`, form);
            onSuccess(); // reload events
        } catch (err) {
            console.error(err);
            setDialog({
                type: "error",
                title: "Import Event",
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
                <svg xmlns="http://w3.org" viewBox="0 0 512 512" width="28px" height="28px">
                    <path
                        d="M504 256C504 114.6 393.4 4 256 4S4 114.6 4 256c0 127 92.6 232.6 214 251V332h-62v-76h62v-54c0-61.2 36-95 119.5-95 34.6 0 71.7 6.1 71.7 6.1v79h-40.4c-30.4 0-39.9 18.9-39.9 38.2v56h78.3l-12.5 76H351v175c121.4-18.4 214-124 214-251z"
                        fill="#000000"/>
                </svg>
                <h2>Import Facebook Event</h2>
                <h5>{event?.facebookEventURL}</h5>
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
                />

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
