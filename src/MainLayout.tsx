import { ReactNode } from "react";
import {Banner} from "./components/Banner";
import "./components/banner.css"


export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <div className="banner-container">
                <Banner />
            </div>
            <main>{children}</main>
        </div>
    );
}
