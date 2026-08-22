import { ReactNode } from "react";
import {Banner} from "./components/Banner";
import "./components/banner.css"


export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="main-layout">
            <div className="banner-container">
                <Banner/>
            </div>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <a href="/privacy.html" target="_blank"
                    style={{fontSize: "12px"}}>Privacy Policy
                </a>
            </footer>
        </div>
    );
}
