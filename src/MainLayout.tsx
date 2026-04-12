import { ReactNode } from "react";
import {Banner} from "./Banner";

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Banner />
            <main>{children}</main>
        </div>
    );
}
