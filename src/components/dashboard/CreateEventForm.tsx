import React, {useEffect, useState} from "react";
import axios from "axios";
import {CreateEventFormProps} from "./eventTypes.interface";
import {EventDetail} from "./events/eventDetailTypes.interface";

const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CreateEventForm({
                                            userId,
                                            event,
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
        price: event?.price || "",
        organization: event?.organization || "",
        phone: event?.phone || "",
        website: event?.website || "",
    });

    const [form, setForm] = useState(buildForm(event));
    const isEdit = !!event;

    useEffect(() => {
        setForm(buildForm(event));
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await axios.put(`/events/${event.event_id}`, form);
            } else {
                await axios.post(`/users/${userId}/events`, form);
            }
            onSuccess(); // reload events
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        }
    };

    return (
        <div style={{marginBottom: 20}}>
            <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>
            {isEdit && (
                <p>Warning: Changes will not affect already submitted platforms.</p>
            )}
            <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={form.name}
            />
            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
            />
            <input
                name="title"
                placeholder="Event Title"
                onChange={handleChange}
                value={form.title}
            />

            <input
                name="location_name"
                placeholder="Location"
                onChange={handleChange}
                value={form.location_name}
            />

            <input
                name="start_datetime"
                type="datetime-local"
                onChange={handleChange}
                value={form.start_datetime}
            />

            <input
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={form.description}
            />

            <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                value={form.address}
            />

            <input
                name="price"
                placeholder="Price"
                onChange={handleChange}
                value={form.price}
            />

            <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                value={form.phone}
            />

            <input
                name="organization"
                placeholder="Organization"
                onChange={handleChange}
                value={form.organization}
            />

            <input
                name="website"
                placeholder="Website"
                onChange={handleChange}
                value={form.website}
            />

            &nbsp;
            <button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create Event"}</button>
            &nbsp;
            <button className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
        </div>
    );
}
