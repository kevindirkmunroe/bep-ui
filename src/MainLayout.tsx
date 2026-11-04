import { ReactNode } from "react";
import {Banner} from "./components/Banner";
import "./components/banner.css"
import {useLocation} from "react-router-dom";


export function MainLayout({ children }: { children: ReactNode }) {
    const location = useLocation();
    const isClosePopup = location.pathname === "/xr/close";

    return (
        <div className="main-layout">
            { !isClosePopup && (
                <div className="banner-container">
                    <Banner/>
                </div>
            )}

            <main className="main-content">
                {children}
            </main>

            { !isClosePopup && (
            <footer className="footer">
                <a href="/privacy.html" target="_blank"
                    style={{fontSize: "12px"}}>Privacy Policy
                </a>
            </footer>
            )}
        </div>
    );
}
