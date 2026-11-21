import React, { useEffect, useState } from "react";
import { api } from "../utils/api"; // Adjust to your Axios instance
import "./favorites.css";
import ImageCarousel from "./ImageCarousel";
import DashboardTabs from "./DashboardTabs";
import {useParams} from "react-router-dom";

export interface FavoriteVenue {
    name: string;
    address: string;
    zip: string;
    region: string;
}

export interface FavoriteImage {
    name: string;
    url: string;
}

export interface UserFavorites {
    venues: FavoriteVenue[];
    images: FavoriteImage[];
    defaults: Defaults;
    mappings: Mappings;
}


const DEFAULT_VALUES = {
    description: "Real Comedians, 1 Stage, 0 Algorithms. Experience standup comedy at its finest. East Bay Express Reader's Poll Best Comedy Night Winner.",
    description_short: "Real Comedians, 1 Stage, 0 Algorithms. Experience standup comedy at its finest. East Bay Express Reader's Poll Best Comedy Night Winner.",
    price: "$25",
    website: "https://www.comedyoakland.com/",
    email: "info@ComedyOakland.com",
    phone: "(510) 214-2626",
    image_url: "https://s3.us-west-1.amazonaws.com/airhorn.events.images/events/aa73e9fd-c367-4154-842c-a808eb37709b.png",
    address: "1951 Embarcadero, Oakland, CA 94606",
    venue: "Quinn's Lighthouse",
    category: "Comedy",
    imported_from: "https://docs.google.com/spreadsheets/d/17JOQAasSjZ4UROKey_an4WxU6lmjV6tS8VGekce_Jgs/edit?gid=1696435403#gid=1696435403",
    name: "Comedy Oakland",
    organization: "Comedy Oakland",
    image: "https://s3.us-west-1.amazonaws.com/airhorn.events.images/events/aa73e9fd-c367-4154-842c-a808eb37709b.png"
};

const DEFAULT_MAPPINGS = {
    name: "name",
    email: "email",
    title: "Show Name",
    description: "description",
    location_name: "Venue",
    start_datetime: "Date, Show",
    address: "address",
    zip: "",
    price: "price",
    website: "website",
    organization: "organization",
    phone: "phone",
    image: "image_url",
    region: "",
    category: "category",
    city: "",
    imported_from: "imported_from"
};

type Defaults = Record<keyof typeof DEFAULT_VALUES, string>;
type Mappings = Record<keyof typeof DEFAULT_MAPPINGS, string>;

const defaultFields = Object.keys(DEFAULT_VALUES) as (keyof Defaults)[];
const mappingFields = Object.keys(DEFAULT_MAPPINGS) as (keyof Mappings)[];

const emptyVenue = (): FavoriteVenue => ({
    name: "",
    address: "",
    zip: "",
    region: ""
});

const emptyImage = (): FavoriteImage => ({
    name: "",
    url: ""
});

export default function Favorites() {
    const [venues, setVenues] = useState<FavoriteVenue[]>([]);
    const [images, setImages] = useState<FavoriteImage[]>([]);
    const [defaults, setDefaults] = useState<Defaults>({ ...DEFAULT_VALUES });
    const [mappings, setMappings] = useState<Mappings>({ ...DEFAULT_MAPPINGS });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const { userId } = useParams<{ userId: string }>();

    useEffect(() => {
        let active = true;

        async function loadFavorites() {
            try {
                const response = await api.get<UserFavorites>(
                    `/users/${userId}/favorites`
                );

                if (active) {
                    setVenues(response.data.venues ?? []);
                    setImages(response.data.images ?? []);
                    setDefaults({ ...DEFAULT_VALUES, ...(response.data.defaults ?? {}) });
                    setMappings({ ...DEFAULT_MAPPINGS, ...(response.data.mappings ?? {}) });
                }

            } catch (err) {
                if (active) {
                    setError("Unable to load favorites.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadFavorites();
        return () => { active = false; };
    }, [userId]);

    const updateVenue = (
        index: number,
        field: keyof FavoriteVenue,
        value: string
    ) => {
        setMessage("");
        setVenues(prev => prev.map((venue, i) =>
            i === index ? { ...venue, [field]: value } : venue
        ));
    };

    const updateImage = (
        index: number,
        field: keyof FavoriteImage,
        value: string
    ) => {
        setMessage("");
        setImages(prev => prev.map((image, i) =>
            i === index ? { ...image, [field]: value } : image
        ));
    };

    const updateDefault = (field: keyof Defaults, value: string) => {
        setMessage("");
        setDefaults(prev => ({ ...prev, [field]: value }));
    };

    const updateMapping = (field: keyof Mappings, value: string) => {
        setMessage("");
        setMappings(prev => ({ ...prev, [field]: value }));
    };

    const saveFavorites = async () => {
        setSaving(true);
        setError("");
        setMessage("");

        try {
            await api.put(`/users/${userId}/favorites`, {
                venues,
                images,
                defaults,
                mappings
            });

            setMessage("Favorites saved successfully.");
        } catch (err) {
            setError("Unable to save favorites.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading favorites...</div>;

    const venueFields: (keyof FavoriteVenue)[] = [
        "name",
        "address",
        "zip",
        "region"
    ];

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 200px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: History */}
            <div style={{ flex: 1, flexDirection: "column", padding: "1px" }}>
                <div style={{paddingLeft: 10}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "2px"}}>
                        <div className="banner-div" style={{
                            width: "100%",
                            height: "60px",
                            objectFit: "cover",
                            objectPosition: "top",
                            fontWeight: 800,
                            fontSize: "34px",
                            borderRadius: "4px",
                            font: "bold",
                            color: "white",
                            display: "flex",
                            alignContent: "left",
                            alignItems: "center"
                        }}>
                            My Events /  <strong style={{fontSize: "34px"}}>Settings</strong>
                        </div>
                    </div>
                </div>
                <>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <DashboardTabs/>
                        <div className="favorites">
                            <section>
                                <div className="favorites-section-header">
                                    <h4><img alt={"wtf"} style={{width: "20px", height: "20px", marginTop: "4px"}}
                                             src={"/icons8-map-48.png"}/> Venues</h4>
                                    <button
                                        className={"btn btn-secondary"}
                                        type="button"
                                        onClick={() =>
                                            setVenues(prev => [...prev, emptyVenue()])
                                        }
                                    >
                                        + Add Venue
                                    </button>
                                </div>

                                <div className="favorites-table-wrapper">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>ZIP</th>
                                            <th>Region</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {venues.map((venue, index) => (
                                            <tr key={index}>
                                                {venueFields.map(field => (
                                                    <td key={field}>
                                                        <input
                                                            value={venue[field]}
                                                            onChange={e =>
                                                                updateVenue(
                                                                    index,
                                                                    field,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => {
                                                            setVenues(prev =>
                                                                prev.filter(
                                                                    (_, i) => i !== index
                                                                )
                                                            );
                                                            setMessage("");
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section>
                                <div className="favorites-section-header">
                                    <h4><img alt={"wtf"} style={{width: "24px", height: "20px", marginTop: "20px"}}
                                             src={"/icons8-image-64.png"}/> Images</h4>
                                    <button
                                        className={"btn btn-secondary"}
                                        type="button"
                                        onClick={() =>
                                            setImages(prev => [...prev, emptyImage()])
                                        }
                                    >
                                        + Add Image
                                    </button>
                                </div>

                                <div className="favorites-table-wrapper">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>URL</th>
                                            <th>Preview</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {images.map((image, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        value={image.name}
                                                        onChange={e =>
                                                            updateImage(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="url"
                                                        value={image.url}
                                                        onChange={e =>
                                                            updateImage(
                                                                index,
                                                                "url",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <img src={image.url} alt="Image" style={{
                                                        width: "60px",
                                                        height: "50px",
                                                        padding: "8px",
                                                        borderRadius: "6px",
                                                        objectFit: "cover" }} />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => {
                                                            setImages(prev =>
                                                                prev.filter(
                                                                    (_, i) => i !== index
                                                                )
                                                            );
                                                            setMessage("");
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                            <hr/>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", width: "100%"}}>
                            {/* DEFAULTS */}
                            <section style={{width: "50%"}}>
                                <div className="favorites-section-header">
                                    <h4><img alt={"wtf"} style={{width: "28px", height: "28px"}}
                                             src={"/icons8-form-24-black.png"}/>&nbsp;Default Field Values</h4>
                                </div>
                                <div className="favorites-table-wrapper">
                                    <table className="favorites-key-value">
                                        <thead>
                                        <tr><th>Field</th><th>Default Value</th></tr>
                                        </thead>
                                        <tbody>
                                        {defaultFields.map(field => (
                                            <tr key={field}>
                                                <td>{field}</td>
                                                <td>
                                                    {field === "description" || field === "description_short" ? (
                                                        <textarea
                                                            rows={3}
                                                            value={defaults[field]}
                                                            onChange={e => updateDefault(field, e.target.value)}
                                                        />
                                                    ) : (
                                                        <input
                                                            value={defaults[field]}
                                                            onChange={e => updateDefault(field, e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* MAPPINGS */}
                            <section style={{width: "50%", marginLeft: "8px"}}>
                                <div className="favorites-section-header">
                                    <h4><img alt={"wtf"} style={{width: "32px", height: "28px"}}
                                             src={"/Google_Sheets_Logo_05.2026.png"}/>&nbsp;Google Sheets Mappings</h4>
                                </div>
                                <div className="favorites-table-wrapper">
                                    <table className="favorites-key-value">
                                        <thead>
                                        <tr><th>Airhorn Field Name</th><th>Your Field Name</th></tr>
                                        </thead>
                                        <tbody>
                                        {mappingFields.map(field => (
                                            <tr key={field}>
                                                <td>{field}</td>
                                                <td>
                                                    <input
                                                        value={mappings[field]}
                                                        onChange={e => updateMapping(field, e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                            </div>

                            {error && <p className="favorites-error">{error}</p>}
                            {message && <p className="favorites-success">{message}</p>}

                            <div className="favorites-footer">
                                <button
                                    className={"btn btn-primary"}
                                    type="button"
                                    disabled={saving}
                                    onClick={saveFavorites}
                                >
                                    {saving ? "Saving..." : "Save All"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </div>

    );
}
