import React, {useEffect, useState} from "react";
import {ViewEventFormProps} from "./eventTypes.interface";
import {EventDetail} from "./events/eventDetailTypes.interface";
import {categories} from "./EventCategories";

import "./form.css";

const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function ReadOnlyViewEventForm({
                                            event,
                                            onClose,
                                        }: ViewEventFormProps) {

    const buildForm = (event?: EventDetail) => ({
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
        category: event?.category || "",
        imported_from: event?.imported_from || "",
    });

    const toDatetimeLocal = (date: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00`;
    };

    const [form, setForm] = useState(buildForm(event));
    const isEdit = !!event;

    useEffect(() => {
        setForm(buildForm(event));
    }, [event]);

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px"
    };

    return (
        <div style={{marginBottom: 20, display: "flex", flexDirection: "column"}}>
            <h2>View Event (read-only)</h2>
            <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                    id="name"
                    name="name"
                    className="input"
                    placeholder="Your Name"
                    value={form.name}
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    className="input"
                    placeholder="Your Email (For Publish Updates)"
                    value={form.email}
                />

                <label htmlFor="title">Event Title</label>
                <input
                    id="title"
                    name="title"
                    className="input"
                    placeholder="Event Title"
                    value={form.title}
                />

                <label htmlFor="location_name">Location / Venue</label>
                <input
                    id="location_name"
                    name="location_name"
                    className="input"
                    placeholder="e.g. Club Deluxe, San Jose Improv"
                    value={form.location_name}
                />

                <label htmlFor="start_datetime">Start Date / Time</label>
                <input
                    id="start_datetime"
                    name="start_datetime"
                    className="input"
                    type="datetime-local"
                    value={form.start_datetime}
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    className="input"
                    placeholder="Description"
                    value={form.description}
                />

                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={form.category || ""}
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
                    value={form.address}
                />

                <label htmlFor="zip">Zip Code</label>
                <input
                    id="zip"
                    name="zip"
                    className="input"
                    placeholder="Zip Code"
                    value={form.zip}
                />

                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    name="price"
                    className="input"
                    placeholder="Leave blank if FREE"
                    value={form.price}
                />

                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    name="phone"
                    className="input"
                    placeholder="Phone"
                    value={form.phone}
                />

                <label htmlFor="organization">Organization</label>
                <input
                    id="organization"
                    name="organization"
                    className="input"
                    placeholder="Organization"
                    value={form.organization}
                />

                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    name="website"
                    className="input"
                    placeholder="Website"
                    value={form.website}
                />

                <label htmlFor="website">Imported From</label>
                <input
                    id="imported_from"
                    name="imported_from"
                    className="input"
                    placeholder="Imported From URI"
                    value={form.imported_from}
                />
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <button className="btn btn-secondary" onClick={() => onClose()}>Close</button>
            </div>
        </div>
    );
}
