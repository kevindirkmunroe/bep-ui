import React, {useEffect, useState} from "react";
import { FacebookEventDetail} from "./events/eventDetailTypes.interface";
import {api} from "../../utils/api";
import {categories} from "./EventCategories";
import {ImportFacebookEventFormProps} from "./eventTypes.interface";

const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

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
        category: event?.category || "",
    });

    const [form, setForm] = useState(buildForm(event));
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
        console.log(`[ImportFacebookEventForm] submit form ${JSON.stringify(form)}`);
        try {
            await api.post(`/users/${userId}/events`, form);
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
                    type="datetime-local"
                    onChange={handleChange}
                    value={form.start_datetime}
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
                <button className="btn btn-primary-greater" onClick={handleSubmit}>Import Event</button>
                &nbsp;
                <button className="btn btn-secondary" onClick={() => onCancel()}>Cancel</button>
            </div>
        </div>
    );
}
