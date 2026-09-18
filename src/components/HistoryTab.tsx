import React from "react";
import ImageCarousel from "./ImageCarousel";
import {NavLink, useNavigate} from "react-router-dom";

export default function HistoryTab(){
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 200px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: History */}
            <div style={{ flex: 1, flexDirection: "column", padding: "12px" }}>
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
                            &nbsp;My History
                        </div>
                    </div>
                </div>
                <>
                    <button className="btn btn-secondary" style={{fontSize: "16px", marginBottom: "12px"}} onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <p/>
                    <h3>TODO: History</h3>
                </>
            </div>
        </div>
    )
}
