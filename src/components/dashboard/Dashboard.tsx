import { useEffect, useState } from "react";
import {NavLink, Outlet, useParams} from "react-router-dom";
import CreateEditEventForm from "./CreateEditEventForm";
import {getEventStatus} from "./events/EventStatus";
import {EventDetail, FacebookEventDetail} from "./events/eventDetailTypes.interface";
import Modal from "../Modal";
import ImageCarousel from "../ImageCarousel";
import {api} from "../../utils/api";
import FacebookURLInputForm from "./FacebookURLInputForm";
import ImportFacebookEventForm from "./ImportFacebookEventForm";
import {FacebookEventRaw, FacebookEventResponseType} from "./ImportFacebookEventResponseType";

export default function Dashboard() {
    const { userId } = useParams();
    const [events, setEvents] = useState<EventDetail[] | null>([]);
    const [showImportFacebookURLForm, setShowImportFacebookURLForm] = useState(false);
    const [showImportFacebookEventForm, setShowImportFacebookEventForm] = useState(false);
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventDetail | null>(null);
    const [facebookImportEvent, setFacebookImportEvent] = useState<FacebookEventDetail | null>(null);

    function isOlderThanToday(date: string) {
        return new Date(date) < new Date();
    }

    async function handleImportFacebookEvent(facebookEventUrl: string) {
        if (!facebookEventUrl || !facebookEventUrl.startsWith('https://www.facebook.com/events')) {
            alert(`Incorrect Facebook url format: ${facebookEventUrl}`);
        }else{
            //
            // TODO: since Apify and Render costs per call, develop this input feature with a static event.
            //  Put Facebook import behind flag VITE_MOCK_FACEBOOK_IMPORT.
            //

            let raw: FacebookEventRaw | undefined;
            if(import.meta.env.VITE_MOCK_FACEBOOK_IMPORT) {
                //
                // BEGIN MOCK Facebook response
                //
                const DEV_EVENT_RESPONSE_JSON =
                    {
                        "data": {
                            "title": "Pride Prom 2026!  Cosmo Alleycats, Quinn Amann Krunch, After-Hours Jam at the Woodchopper's Ball",
                            "description": "PRIDE PROM 2026:\\nDidn't get your fill of Pride and want more?  Who says Pride is over after the Parade on Sunday?  Come to Pride Prom 2026, and dance to SF's hottest swing band at the historic Verdi Club!\\n\\nOn Tuesday, June 30th, come join us for a fabulously swingin’ evening of music, dance, and performance at the Woodchopper’s Ball’s Pride Prom 2026!  Dress up, show your pride, have fun, dance to a live band, the Cosmo Alleycats, and celebrate the art of human connection via partner dancing!\\n\\nCOSMO ALLEYCATS:\\nFounded in 2010, the Cosmo Alleycats are a San Francisco-based vintage dance band that brings to the stage a potent mix of vintage dance music with a dynamic, soulful delivery.  The band's talented musicians draw from several decades of exhilarating American music and inspired originals to deliver a fun and engaging performance that will make you want to dance!\\nWebsite: https://www.cosmoalleycats.com/\\nYouTube: https://www.youtube.com/watch?v=8UmwhG8XZ0Q\\n\\nQUINN AMANN KRUNCH:\\nQuinn Amann Krunch, the reigning Miss GAPA 2025, is a dynamic drag performer known for blending glamour, creativity, and heartfelt storytelling into every show.  With her signature charisma and vibrant stage presence, she captivates audiences while celebrating community, culture, and self-expression.  Every Quinn Amann Krunch performance is a memorable mix of elegance, fun, and flair.\\n\\nWOODCHOPPER'S BALL:\\nThe Woodchopper's Ball, San Francisco's swing hot spot, is a weekly Tuesday night swing dance event held at the historic Verdi Club in San Francisco's Mission district.  Named after the classic 1939 swing tune by the Woody Herman Orchestra (and their biggest hit!), it features monthly classes, a full bar (21+ only), and a dance party with a drop-in lesson and the largest variety of live swing dance music in town!\\nhttp://www.woodchoppersball.com/\\n\\n* LIVE MUSIC DANCE PARTY, 9:00-11:30pm, with a different band each week!  $20 admission (cash only, please) includes a drop-in Basic Swing dance lesson (9:00-9:15pm), perfect for complete beginners (no partner required)!\\n\\n* PHOTO BOOTH: Capture the magic of prom night with our fun and free photo booth—strike a pose, grab a prop, and take home unforgettable memories!  Don’t miss your chance to snap the perfect shot with your friends!\\n\\n* AFTER-HOURS MUSICIANS JAM SESSION & PARTY, 11:30pm-1:30am, in the lounge, with the bar open extra late and space for dancing!  Included with admission to Live Music Dance Party, must arrive before doors close at 12:00am midnight.  Musicians of all levels welcome!\\n\\n* FULL BAR & LOUNGE, 8:00pm-closing (21+ only)!  Enjoy a classic cocktail in the swanky vintage bar and lounge!\\n\\n* 2,500-SQ-FT DANCE FLOOR: Large, beautiful, hardwood dance floor with plenty of room to swing out!\\n\\n* JUNE (5-week) LINDY HOP and BALBOA monthly class series conclude tonight, 7:00-9:00pm.  Single Monthly Class drop-in: $30/person/week (cash only, includes Dance Party!), no partner required.\\nhttp://www.woodchoppersball.com/monthly-classes/\\n\\nEVENING SCHEDULE:\\n6:30pm:\\t\\tDoors Open\\n7:00-8:00pm:\\tMonthly Intermediate Lindy Hop & Balboa Classes\\n8:00-9:00pm:\\tMonthly Beginning Lindy Hop & Balboa Classes\\n8:00pm-closing:\\tFull Bar Open (21+ only)\\n9:00-9:15pm:\\tDrop-In Basic Swing Dance Lesson\\n9:00-11:30pm:\\tLive Music Dance Party\\n10:15-10:30pm:\\tDrag Performer Quinn Amann Krunch\\n11:30pm-1:30am:\\tAfter-Hours Musicians Jam Session",
                            "start_datetime": "",
                            "end_datetime": "",
                            "location_name": "",
                            "address": "",
                            "website": "https://www.facebook.com/events/1628799931534768",
                            "image_url": ""
                        },
                        "raw": {
                            "event_id": "1628799931534768",
                            "name": "Pride Prom 2026!  Cosmo Alleycats, Quinn Amann Krunch, After-Hours Jam at the Woodchopper's Ball",
                            "description": "PRIDE PROM 2026:\\nDidn't get your fill of Pride and want more?  Who says Pride is over after the Parade on Sunday?  Come to Pride Prom 2026, and dance to SF's hottest swing band at the historic Verdi Club!\\n\\nOn Tuesday, June 30th, come join us for a fabulously swingin’ evening of music, dance, and performance at the Woodchopper’s Ball’s Pride Prom 2026!  Dress up, show your pride, have fun, dance to a live band, the Cosmo Alleycats, and celebrate the art of human connection via partner dancing!\\n\\nCOSMO ALLEYCATS:\\nFounded in 2010, the Cosmo Alleycats are a San Francisco-based vintage dance band that brings to the stage a potent mix of vintage dance music with a dynamic, soulful delivery.  The band's talented musicians draw from several decades of exhilarating American music and inspired originals to deliver a fun and engaging performance that will make you want to dance!\\nWebsite: https://www.cosmoalleycats.com/\\nYouTube: https://www.youtube.com/watch?v=8UmwhG8XZ0Q\\n\\nQUINN AMANN KRUNCH:\\nQuinn Amann Krunch, the reigning Miss GAPA 2025, is a dynamic drag performer known for blending glamour, creativity, and heartfelt storytelling into every show.  With her signature charisma and vibrant stage presence, she captivates audiences while celebrating community, culture, and self-expression.  Every Quinn Amann Krunch performance is a memorable mix of elegance, fun, and flair.\\n\\nWOODCHOPPER'S BALL:\\nThe Woodchopper's Ball, San Francisco's swing hot spot, is a weekly Tuesday night swing dance event held at the historic Verdi Club in San Francisco's Mission district.  Named after the classic 1939 swing tune by the Woody Herman Orchestra (and their biggest hit!), it features monthly classes, a full bar (21+ only), and a dance party with a drop-in lesson and the largest variety of live swing dance music in town!\\nhttp://www.woodchoppersball.com/\\n\\n* LIVE MUSIC DANCE PARTY, 9:00-11:30pm, with a different band each week!  $20 admission (cash only, please) includes a drop-in Basic Swing dance lesson (9:00-9:15pm), perfect for complete beginners (no partner required)!\\n\\n* PHOTO BOOTH: Capture the magic of prom night with our fun and free photo booth—strike a pose, grab a prop, and take home unforgettable memories!  Don’t miss your chance to snap the perfect shot with your friends!\\n\\n* AFTER-HOURS MUSICIANS JAM SESSION & PARTY, 11:30pm-1:30am, in the lounge, with the bar open extra late and space for dancing!  Included with admission to Live Music Dance Party, must arrive before doors close at 12:00am midnight.  Musicians of all levels welcome!\\n\\n* FULL BAR & LOUNGE, 8:00pm-closing (21+ only)!  Enjoy a classic cocktail in the swanky vintage bar and lounge!\\n\\n* 2,500-SQ-FT DANCE FLOOR: Large, beautiful, hardwood dance floor with plenty of room to swing out!\\n\\n* JUNE (5-week) LINDY HOP and BALBOA monthly class series conclude tonight, 7:00-9:00pm.  Single Monthly Class drop-in: $30/person/week (cash only, includes Dance Party!), no partner required.\\nhttp://www.woodchoppersball.com/monthly-classes/\\n\\nEVENING SCHEDULE:\\n6:30pm:\\t\\tDoors Open\\n7:00-8:00pm:\\tMonthly Intermediate Lindy Hop & Balboa Classes\\n8:00-9:00pm:\\tMonthly Beginning Lindy Hop & Balboa Classes\\n8:00pm-closing:\\tFull Bar Open (21+ only)\\n9:00-9:15pm:\\tDrop-In Basic Swing Dance Lesson\\n9:00-11:30pm:\\tLive Music Dance Party\\n10:15-10:30pm:\\tDrag Performer Quinn Amann Krunch\\n11:30pm-1:30am:\\tAfter-Hours Musicians Jam Session",
                            "url": "https://www.facebook.com/events/1628799931534768/",
                            "start_timestamp": 1782878400,
                            "end_timestamp": 1782894600,
                            "start_date": "2026-07-01T04:00:00+00:00",
                            "end_date": "2026-07-01T08:30:00+00:00",
                            "formatted_date": "Tuesday, June 30, 2026 at 9:00 PM – 1:30 AM PDT",
                            "timezone": "PDT",
                            "is_online": false,
                            "is_canceled": false,
                            "location_name": "Verdi Club",
                            "location_address": "2424 Mariposa St",
                            "location_city": "San Francisco",
                            "latitude": 37.76339,
                            "longitude": -122.40792,
                            "photo_url": "https://scontent-iad6-1.xx.fbcdn.net/v/t39.30808-6/711709013_1554450810015133_2791592136814150978_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x628&ctp=s1200x628&_nc_cat=106&ccb=1-7&_nc_sid=75d36f&_nc_ohc=yVE1Ouc9ZRgQ7kNvwFuHwaq&_nc_oc=AdoyCaxyXtmxsHtQnoibSjaeg_7yRrnslDAQgSU4SlvJku238TdtpU_D1t-OBmEJYqs&_nc_zt=23&_nc_ht=scontent-iad6-1.xx&_nc_gid=H-KMaat6_4R0DWLXUPqvbw&_nc_ss=7f289&oh=00_Af8cZlJUJfE6qOPE_ULXjT8sz6OXtKvDrLcp-gZmEYOC9A&oe=6A47B4C0",
                            "video_url": "",
                            "hosts": [
                                {
                                    "name": "Woodchopper's Ball",
                                    "url": "https://www.facebook.com/WoodchoppersBallSF",
                                    "type": "User"
                                },
                                {
                                    "name": "Cosmo Alleycats",
                                    "url": "https://www.facebook.com/cosmoalleycats",
                                    "type": "User"
                                }
                            ],
                            "categories": [
                                "Dance"
                            ],
                            "ticket_url": "",
                            "online_type": "",
                            "users_responded": 61,
                            "input_url": "https://www.facebook.com/events/1628799931534768",
                            "scraped_at": "2026-06-29T02:39:01.456751+00:00"
                        }
                    };

                 raw = DEV_EVENT_RESPONSE_JSON.raw;
                //
                // END MOCK Facebook response
                //

            }else{
                let result = null;
                try{
                    result = await api.post<FacebookEventResponseType>("/events/import/facebook", {
                        facebookEventUrl
                    });
                    // alert(`Imported Facebook event: ${JSON.stringify(result.data)}`);
                }catch(err: Error | any){
                    if(err.status === 404){
                        alert(`Facebook event not found: ${facebookEventUrl}. The event may be private, restricted, or unsupported.`);
                    }else{
                        alert(`Error importing Facebook event: ${err.message}`);
                    }
                }

                raw = result?.data.raw;
                if(!raw){
                    alert(`Facebook import ${facebookEventUrl} failed.`);
                    return;
                }
            }

            // raw data includes \n \t, replace them
            const cleanDescription = raw.description?.replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t");

            interface Host  {
                name: string;
                url: string;
                type: string;
            }

            const fbImportEvent: FacebookEventDetail = {
                facebookEventURL: facebookEventUrl,
                name: raw.name,
                email: 'bayareaeventpromoter@gmail.com',
                title: raw.name,
                description: cleanDescription,
                location_name: raw.location_name,
                start_datetime: raw.start_date,
                address: raw.location_address,
                website: raw.input_url,
                organization: raw.hosts.map((item: Host) => item.name).join(", "),
                region: raw.location_city,
                category: raw.categories[0],
                city: raw.location_city,
            }
            setFacebookImportEvent(fbImportEvent);
            setShowImportFacebookEventForm(true);
        }
    }


    function getActiveEventCount(){
        const activeEvents = (events || []).filter(e => {
            return getEventStatus(e) !== "submitted" && !isOlderThanToday(e.start_datetime);;
        });
        return activeEvents.length;
    }

    function getSubmittedEventCount(){
        const submittedEvents = (events || []).filter(e => {
            return getEventStatus(e) === "submitted";
        });
        return submittedEvents.length;
    }

    function getExpiredEventCount(){
        const submittedEvents = (events || []).filter(e => {
            return getEventStatus(e) !== "submitted" && isOlderThanToday(e.start_datetime);;
        });
        return submittedEvents.length;
    }

    const loadEvents = async () => {
        setShowCreateEventForm(false);
        try{
            const eventsRes = await api.get(`/users/${userId}/events`);
            setEvents(eventsRes.data.data);
        } catch (err: Error | any) {
            const status = err.response?.status;

            if (status === 404) {
                setEvents([]);
                return;
            }

            if (status === 401) {
                console.log("Auth not ready yet, retrying...");
                return;
            }

            console.error("loadEvents failed", err);
        }
    };

    useEffect(() => {
        if (!userId) return;

        loadEvents();
    }, [userId]);

    if (!userId) return <div style={{marginTop: "50px"}}>Loading...</div>;

    const activeEventCount = getActiveEventCount();
    const submittedEventCount = getSubmittedEventCount();
    const expiredEventCount = getExpiredEventCount();
    // const publishedEventCount = getPublishedEventCount();


    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>

            {/* RIGHT: Existing content */}
            <div style={{ flex: 1 }}>
                <div style={{ paddingLeft: 40 }}>
                    {(showCreateEventForm || editingEvent) && userId && (
                        <Modal onClose={() => setShowCreateEventForm(false)}>
                            <CreateEditEventForm
                                key={editingEvent?.event_id || "new"}   // 👈 Force react to recreate component
                                userId={userId}
                                event={editingEvent || undefined}
                                onSuccess={() => {
                                    setShowCreateEventForm(false);
                                    setEditingEvent(null);
                                    loadEvents();
                                }}
                                onCancel={() => {
                                    setShowCreateEventForm(false);
                                    setEditingEvent(null);
                                }}
                            />
                        </Modal>
                    )}
                    {showImportFacebookURLForm && userId && (
                        <Modal onClose={() => setShowImportFacebookURLForm(false)}>
                            <FacebookURLInputForm onImport={handleImportFacebookEvent}
                                                  open={true}
                                                  onClose={() => setShowImportFacebookURLForm(false)}
                            />
                        </Modal>
                    )}
                    {showImportFacebookEventForm && userId && (
                    <Modal onClose={() => setShowImportFacebookEventForm(false)}>
                        <ImportFacebookEventForm
                            userId={userId}
                            event={facebookImportEvent || undefined}
                            onSuccess={() => {
                                setShowCreateEventForm(false);
                                setFacebookImportEvent(null);
                                loadEvents();
                            }}
                            onCancel={() => {
                                setShowImportFacebookEventForm(false);
                                setFacebookImportEvent(null);
                            }}
                        />
                    </Modal>
                    )}
                    <div className="banner-div" style={
                        {
                            font: "bold",
                            height: "100px",
                            marginBottom: "6px",
                            fontWeight: 800,
                            fontSize: "40px",
                            borderRadius: "4px",
                            color: "white",
                            display: "flex",
                            alignContent: "left",
                            alignItems: "center"
                        }
                    }>&nbsp;My Events
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{display: "flex", width: "100%", flexDirection: "row", marginBottom: "2px", justifyContent: "space-between"}}>
                            <nav style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "14px", marginLeft: "12px" }}>
                                {activeEventCount > 0 ? (
                                    <NavLink
                                        to="events" end
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "18px" : "15px",
                                            textDecoration: isActive ? "underline": "none",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Active({activeEventCount})
                                    </NavLink>
                                ) : (
                                    <div style={{fontSize: "18px"}}>
                                        Active(0)
                                    </div>
                                )}
                                {submittedEventCount > 0 ? (
                                    <NavLink
                                        to="submitted"
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "18px" : "15px",
                                            textDecoration: isActive ? "underline": "none",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Submitted({submittedEventCount})
                                    </NavLink>
                                ) : (
                                    <div style={{fontSize: "15px"}}>
                                        Submitted(0)
                                    </div>
                                )}
                                {expiredEventCount > 0 && (
                                    <NavLink
                                        to="expired"
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "18px" : "15px",
                                            textDecoration: isActive ? "underline": "none",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Expired({expiredEventCount})
                                    </NavLink>
                                )}
                                {/* For V1 skip published, user can check their inboxes */}
                                {/*{publishedEventCount > 0 ? (*/}
                                {/*    <NavLink*/}
                                {/*        to={"expired"}*/}
                                {/*        style={({ isActive }) => ({*/}
                                {/*            fontSize: isActive ? "20px" : "15px",*/}
                                {/*            fontWeight: isActive ? "bold" : "normal"*/}
                                {/*        })}>*/}
                                {/*        Published({publishedEventCount})*/}
                                {/*    </NavLink>*/}
                                {/*) : (*/}
                                {/*    <div style={{fontSize: "15px"}}>*/}
                                {/*        Published(0)*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </nav>
                            <div>
                                <button className="btn btn-primary" style={{marginTop: '10px', marginLeft: "4px", fontSize: "14px"}} onClick={() => setShowCreateEventForm(true)}>
                                    + Create
                                </button>
                                <button className="btn btn-primary" style={{marginTop: '10px', marginLeft: "4px", fontSize: "14px", backgroundColor: "#1877F2"}} onClick={() => setShowImportFacebookURLForm(true)}>
                                    &nbsp;
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M12 3v12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M7 10l5 5 5-5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5 20h14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <svg xmlns="http://w3.org" viewBox="0 0 320 512" width="14" height="14">
                                            <path fill="currentColor" d="M80 299.3V256H12V171.3H80V114.4C80 47.3 120.7 10 181 10c28.8 0 53.6 2.1 60.8 3v70.5h-41.7c-32.6 0-38.9 15.5-38.9 38.2V171.2h78.2L229.3 256H161.2V512H80V299.3z"/>
                                    </svg>Import Event
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ROUTED CONTENT */}
                    <div style={{height: '600px', // Fixed height
                        marginTop: '10px',
                        overflowY: 'auto', // Enable vertical scrolling
                        border: '1px solid #ccc',
                        borderRadius: 2
                        }}>
                        <Outlet context={{ events, setEditingEvent, reload: loadEvents }} />
                    </div>
                </div>

            </div>
        </div>
    );
}
