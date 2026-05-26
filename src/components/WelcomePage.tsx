import {NavLink} from "react-router-dom";
import ImageCarousel from "./ImageCarousel";

export function WelcomePage() {
    return (
        <div>
            <div style={{ display: "flex", gap: "2px" }}>
                {/* LEFT: Carousel */}
                <div style={{ flex: "0 0 300px" }}>
                    <ImageCarousel />
                </div>
                {/* RIGHT: Existing content */}
                <div style={{ flex: 1 }}>
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
                </div>
            </div>
        </div>
    );
}
