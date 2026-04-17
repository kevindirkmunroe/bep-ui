import React, { useState } from "react";
import axios from "axios";
import {CreateEventFormProps} from "./eventTypes.interface";

export default function CreateEventForm({
                                            userId,
                                            onSuccess,
                                            onCancel,
                                        }: CreateEventFormProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        title: "",
        location_name: "",
        start_datetime: "",
        description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`/users/${userId}/event`, form);
            onSuccess(); // reload events
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        }
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h3>Create Event</h3>

            <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
            />
            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />
            <input
                name="title"
                placeholder="Event Title"
                onChange={handleChange}
            />

            <input
                name="location_name"
                placeholder="Location"
                onChange={handleChange}
            />

            <input
                name="start_datetime"
                type="datetime-local"
                onChange={handleChange}
            />

            <input
                name="description"
                placeholder="Description"
                onChange={handleChange}
            />

            &nbsp;<button onClick={handleSubmit}>Save</button>&nbsp;
            <button onClick={() => onCancel()}>Cancel</button>
        </div>
    );
}
