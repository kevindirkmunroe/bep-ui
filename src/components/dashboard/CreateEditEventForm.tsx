import React, {useEffect, useState} from "react";
import {CreateEventFormProps} from "./eventTypes.interface";
import {EventDetail} from "./events/eventDetailTypes.interface";
import {api} from "../../utils/api";
import {categories} from "./EventCategories";

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
            alert("Failed to create event");
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
            <h2>{isEdit ? "Edit Event" : "New Event"}</h2>
            {isEdit && (
                <p>Warning: Changes will not affect already submitted platforms.</p>
            )}
            <div className="form-group">
                <input
                    name="name"
                    className="input"
                    placeholder="Your Name"
                    onChange={handleChange}
                    value={form.name}
                />
                <input
                    name="email"
                    className="input"
                    placeholder="Your Email (For Publish Updates)"
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
                    placeholder="Location / Venue (e.g. 'Club Deluxe', 'San Jose Improv')"
                    onChange={handleChange}
                    value={form.location_name}
                />

                <input
                    name="start_datetime"
                    className="input"
                    value={startDatetime}
                    type="datetime-local"
                    onChange={handleChange}
                    value={startDatetime}
                />

                <textarea
                    name="description"
                    rows={5}
                    className="input"
                    placeholder="Description"
                    onChange={handleChange}
                    value={form.description}
                />

                <select
                    value={form.category || ""}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            category: e.target.value
                        })
                    }
                    style={inputStyle}
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <input
                    name="address"
                    className="input"
                    placeholder="Address"
                    onChange={handleChange}
                    value={form.address}
                />

                <input
                    name="zip"
                    className="input"
                    placeholder="Zip Code (You want this)"
                    onChange={handleChange}
                    value={form.zip}
                />

                <input
                    name="price"
                    className="input"
                    placeholder="Price (Leave blank if FREE)"
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
                <button className="btn btn-primary-greater" onClick={handleSubmit}>{isEdit ? "Save Changes" : "Create Event"}</button>
                &nbsp;
                <button className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
            </div>
        </div>
    );
}
