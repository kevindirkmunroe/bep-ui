import React, {useEffect, useState} from "react";
import {CreateEventFormProps} from "./eventTypes.interface";
import {EventDetail} from "./events/eventDetailTypes.interface";
import {api} from "../../utils/api";
import {categories} from "./EventCategories";
import BaseDialog, {DialogState} from "../BaseDialog";

import "./form.css";

const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CreateEditEventForm({
                                            userId,
                                            event,
                                            initialDate,
                                            onSuccess,
                                            onCancel,
                                        }: CreateEventFormProps) {

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
    });

    const toDatetimeLocal = (date: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00`;
    };

    const [form, setForm] = useState(buildForm(event));
    const [startDatetime, setStartDatetime] = useState(
        event?.start_datetime
            ? event.start_datetime.slice(0, 16)
            : initialDate
                ? toDatetimeLocal(initialDate)
                : ""
    );
    const [dialog, setDialog] = useState<DialogState>(null);
    const isEdit = !!event;

    useEffect(() => {
        setForm(buildForm(event));
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        // special case- date display uses derived var startDateTime
        if(e.target.name === 'start_datetime'){
            setStartDatetime(e.target.value);
        }
    };

    // TODO: handle image upload
    // const handleFileChange = async (
    //     e: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //
    //     const base64 = await fileToBase64(file);
    //
    //     window.postMessage({
    //         type: "BEP_IMAGE_UPLOAD",
    //         payload: {
    //             base64,
    //             filename: file.name,
    //             mimeType: file.type
    //         }
    //     }, "*");
    // };

    const handleSubmit = async () => {
        console.log(`[CreateEventForm] submit form ${JSON.stringify(form)}`);
        try {
            if (isEdit) {
                await api.put(`/events/${event.event_id}`, form);
            } else {
                await api.post(`/users/${userId}/events`, form);
            }
            onSuccess(); // reload events
        } catch (err) {
            console.error(err);
            setDialog({
                type: "error",
                title: "Create Event",
                message: "Failed to create event"
            });
        }
    };
    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px"
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
            <h2>{isEdit ? "Edit Event" : "New Event"}</h2>
            {isEdit && (
                <p>Warning: Changes will not affect already submitted platforms.</p>
            )}
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
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <button className="btn btn-primary-greater"
                        onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create Event"}</button>
                &nbsp;
                <button className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
            </div>
        </div>
    );
}
