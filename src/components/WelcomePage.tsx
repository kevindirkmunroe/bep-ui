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
                    <ImageCarousel />
                </div>
                {/* RIGHT: Existing content */}
                <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: "100vh"}}>
                    <div style={{ paddingLeft: 40, marginTop: "10%" }}>
                        <strong style={{fontSize: "24px", color: "#D2492C"}}>Your <b style={{fontSize:"28px"}}>Local</b> Events Promoter</strong>
                        <div style={{marginTop: 50}}>
                            <nav style={{ display: "flex", justifyContent: "center", gap: "20px"}}>
                                <NavLink style={{ fontSize: "24px" }}
                                         to="/login">
                                    Login
                                </NavLink>
                                <NavLink style={{ marginLeft: "10px", fontSize: "24px" }}
                                         to="/register">
                                    Sign Up
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                    <div style={{marginTop: "auto", display: "flex", marginBottom: "4px", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <img style={{transform: "scale(0.6)"}} src={"/funcheapsf.jpg"} />
                        <img style={{transform: "scale(0.6)"}} src={"/indybay.jpg"} />
                        <img style={{transform: "scale(0.6)"}} src={"/visit_oakland.jpg"} />
                        <img style={{transform: "scale(0.6)"}} src={"/sfstation.jpg"} />
                    </div>
                    <div style={{marginBottom: "30px",padding: "20px", fontSize: "14px"}}>All trademarks and logos are the property of their respective owners.
                        LocalBuzz is not affiliated with or endorsed by these platforms.</div>
                </div>
            </div>
        </div>
    );
}
