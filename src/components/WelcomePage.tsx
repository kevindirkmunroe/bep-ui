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
                    <div style={{ paddingLeft: 40 }}>
                        <h3>Your AI-Powered Event Promoter</h3>
                        <div style={{marginTop: 50}}>
                            <nav style={{ display: "flex", justifyContent: "center", gap: "20px"}}>
                                <NavLink style={{ fontSize: "24px" }}
                                         to="/login">
                                    Login
                                </NavLink>
                                <NavLink style={{ fontSize: "24px" }}
                                         to="/register">
                                    Register
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
