import React, {useEffect, useState} from "react";
import axios from "axios";
import {CreateEventFormProps} from "./eventTypes.interface";
import {EventDetail} from "./events/eventDetailTypes.interface";
import {fileToBase64} from "../../utils/FileUtils";

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

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const base64 = await fileToBase64(file);

        window.postMessage({
            type: "BEP_IMAGE_UPLOAD",
            payload: {
                base64,
                filename: file.name,
                mimeType: file.type
            }
        }, "*");
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
        <div style={{marginBottom: 20, display: "flex", flexDirection: "column"}}>
            <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>
            {isEdit && (
                <p>Warning: Changes will not affect already submitted platforms.</p>
            )}
            <div className="form-group">
                <input
                    name="name"
                    className="input"
                    placeholder="Name"
                    onChange={handleChange}
                    value={form.name}
                />
                <input
                    name="email"
                    className="input"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                />
                <input
                    name="title"
                    className="input"
                    placeholder="Event Title"
                    onChange={handleChange}
                    value={form.title}
                />

                <input
                    name="location_name"
                    className="input"
                    placeholder="Location"
                    onChange={handleChange}
                    value={form.location_name}
                />

                <input
                    name="start_datetime"
                    className="input"
                    type="datetime-local"
                    onChange={handleChange}
                    value={form.start_datetime}
                />

                <input
                    name="description"
                    className="input"
                    placeholder="Description"
                    onChange={handleChange}
                    value={form.description}
                />

                <input
                    name="address"
                    className="input"
                    placeholder="Address"
                    onChange={handleChange}
                    value={form.address}
                />

                <input
                    name="price"
                    className="input"
                    placeholder="Price"
                    onChange={handleChange}
                    value={form.price}
                />

                <input
                    name="phone"
                    className="input"
                    placeholder="Phone"
                    onChange={handleChange}
                    value={form.phone}
                />

                <input
                    name="organization"
                    className="input"
                    placeholder="Organization"
                    onChange={handleChange}
                    value={form.organization}
                />

                <input
                    name="website"
                    className="input"
                    placeholder="Website"
                    onChange={handleChange}
                    value={form.website}
                />
                {/*  TODO- enable when extension receiving File step is fixed.
                      <input type="file" id="eventImage" name="eventImage" accept="image/png, image/jpeg" onChange={handleFileChange}/>
                */}
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <button className="btn btn-primary" onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create"}</button>
                &nbsp;
                <button className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
            </div>
        </div>
    );
}
