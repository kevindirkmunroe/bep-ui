import {EventDetail} from "./eventDetailTypes.interface";
import "./serviceSelectionPage.css";
import {Link} from "react-router-dom";
import React from "react";

export enum ServiceSelectionStatus {
    NO_SELECTION = "None Selected",
    DIY = "DIY",
    PRO = "Pro",
}

export interface ServiceSelectionFormProps {
    userId?: string;
    event?: EventDetail;  // Edit mode
    onSelectService: (selection: ServiceSelectionStatus) => void;
}

export default function ServiceSelectionPage({userId, onSelectService}  : ServiceSelectionFormProps) {

    return (
        <main className="pricing-page">
            <div className="pageHero">
                <div className="container">
                    <div className="eyebrow"><h2>Promote Your Event</h2> Pricing & Services</div>
                </div>
            </div>

            <div className="section">
                <div className="container">
                    <div className="prices">
                        <div className="card">
                            <div className="eyebrow">Self-Service</div>
                            <h3>You promote with Airhorn.events.</h3>
                            <p>Use your Airhorn account and promotion workflow yourself.</p>

                            <div className="priceRow">
                                <div className="mini"><span>ONE-TIME EVENT</span><strong>$19.95</strong></div>
                            </div>

                            <ul>
                                <li>Airhorn.events account</li>
                                <li>Create or import your event</li>
                                <li>Supported promotion workflow</li>
                                <li>Platform status tracking</li>
                            </ul>

                            <button className="btn" style={{fontSize: "16px"}} onClick={(e) => {
                                e.stopPropagation();
                                onSelectService(ServiceSelectionStatus.DIY)}
                            }>Get Started</button>
                        </div>

                        <div className="card featured">
                            <div className="eyebrow">Pro Service</div>
                            <h3>Send us your event. We promote it.</h3>
                            <p>Hand off the promotion work to Airhorn.events custom workflow.</p>

                            <div className="priceRow">
                                <div className="mini"><span>ONE-TIME EVENT</span><strong>$29.95</strong></div>
                            </div>

                            <ul>
                                <li>Account managed by Airhorn.events</li>
                                <li>Airhorn handles event promotion</li>
                                <li>Supported destination workflow</li>
                                <li>Promotion completion tracking</li>
                            </ul>
                            <button className="btn" style={{fontSize: "16px"}} onClick={(e) => {
                                e.stopPropagation();
                                onSelectService(ServiceSelectionStatus.PRO)}
                            }>Submit to PRO</button>
                        </div>
                    </div>
                    <div style={{paddingTop: "10px"}}>
                        <Link to={`/dashboard/${userId}/events`}>
                            <img
                                src="/icons8-home-48.link.png"
                                alt="Home"
                                style={{
                                    height: "16px",
                                    width: "auto",
                                    marginLeft: "10px",
                                    marginRight: "4px",
                                    objectFit: "contain",
                                }}
                            />
                            Back To Events
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
