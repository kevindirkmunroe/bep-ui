import {api} from "../../../utils/api";
import ImageCarousel from "../../ImageCarousel";
import React, {useEffect, useState} from "react";
import EventBreadcrumb from "./EventBreadcrumb";
import {useParams} from "react-router-dom";
import {EventDetail} from "./eventDetailTypes.interface";
import {EventCompletionLog} from "./EventCompletionLog";

export default function PromoteCompleteDashboard(){

    const { eventId } = useParams();

    const [event, setEvent] = useState<EventDetail | null>(null);

    useEffect(() => {
        loadEventPlatforms();
    }, [eventId]);

    const loadEventPlatforms = async () => {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    function truncateString(str: string | undefined, limit: number, ending: string = '...'): string {
        if(!str){
            return "unknown"
        }

        if (str.length <= limit) {
            return str;
        }
        return str.slice(0, limit - ending.length) + ending;
    }

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: Receipts */}
            <div style={{ flex: 1 }}>

            <div style={{paddingLeft: 40}}>

                <div style={{width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "20px"}}>
                    <div className="banner-div" style={{
                        width: "100%",
                        height: "100px",
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
                        &nbsp;My Event &gt; Promote &gt; Published
                    </div>
                </div>

                <EventBreadcrumb eventTitle={truncateString(event?.title, 24)}/>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                {/* List completed promotions only: "/events/:eventId" */}
                <div style={{marginTop: "20px", marginLeft: "20px"}}>
                    <EventCompletionLog event={event}/>
                </div>
            </div>
            </div>
        </div>
    )
}
