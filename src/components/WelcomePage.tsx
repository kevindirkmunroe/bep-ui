import {Navigate, NavLink} from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import {useUser} from "../UserContext";

export function WelcomePage() {
    const { user, loading } = useUser();
    if (loading) {
        return <div>Loading...</div>;
    }

    if (user?.userId) {
        return <Navigate to={`/dashboard/${user.userId}`} replace />;
    }
    return (
        <div>
            <div style={{ display: "flex", gap: "2px" }}>
                {/* LEFT: Carousel */}
                <div style={{ flex: "0 0 300px" }}>
                    <ImageCarousel timeout={6000} />
                </div>
                {/* RIGHT: Existing content */}
                <div style={{display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: "100vh"}}>
                    <div style={{paddingLeft: 40, marginTop: "2%"}}>
                        <strong style={{fontSize: "24px", color: "#D2492C"}}>Promote Your <b style={{color: "black", fontSize: "28px"}}>Local
                            </b> <b>Bay Area</b> Events</strong>
                        <p style={{marginTop: "20px"}}>"Make it Once, Promote it Everywhere"</p>
                        <div style={{marginTop: 50}}>
                            <nav style={{display: "flex", justifyContent: "center", gap: "20px"}}>
                                <NavLink style={{fontSize: "24px"}}
                                         to="/login">
                                    Login
                                </NavLink>
                                <NavLink style={{marginLeft: "10px", fontSize: "24px"}}
                                         to="/register">
                                    Sign Up
                                </NavLink>
                            </nav>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <img
                            src="/splash-simple.png"
                            style={{
                                height: "200px",
                                width: "auto",
                            }}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        marginBottom: "4px",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img style={{borderRadius: "5px", transform: "scale(0.6)", width: "200px", height: "64px"}} src={"/east-bay-magazine.png"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)"}} src={"/funcheapsf.jpg"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)", width: "200px", height: "64px"}} src={"/patch.png"}/>
                    </div>
                    <div style={{
                        display: "flex",
                        marginBottom: "4px",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)"}} src={"/do_the_bay.jpg"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)"}} src={"/sfstation.jpg"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)", width: "390px", height: "104px"}} src={"/metro-silicon-valley.png"}/>
                    </div>
                    <div style={{
                        marginTop: "4px",
                        display: "flex",
                        marginBottom: "4px",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)"}} src={"/indybay.jpg"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)", width: "200px", height: "64px"}} src={"/east-bay-times.png"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.6)"}} src={"/visit_oakland.jpg"}/>
                        <img style={{borderRadius: "5px",transform: "scale(0.8)", width: "64px", height: "64px"}} src={"/sfweekly2.jpg"}/>
                    </div>
                    <div style={{marginBottom: "30px", padding: "20px", fontSize: "14px"}}>All trademarks and logos are
                        the property of their respective owners.
                        Airhorn.events is not affiliated with or endorsed by these platforms.
                    </div>
                </div>
            </div>
        </div>
    );
}
