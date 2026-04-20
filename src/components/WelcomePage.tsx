import {NavLink} from "react-router-dom";

export function WelcomePage() {
    return (
        <div>
            <h1>Welcome to BEP</h1>
            <p>Your AI-Powered BayArea Event Promoter</p>
            <div style={{marginTop: 50}}>
                <nav style={{ display: "flex", justifyContent: "center", gap: "20px"}}>
                    <NavLink style={{ fontSize: "32px", fontWeight: "bold" }}
                        to="/login">
                        Login
                    </NavLink>
                    <NavLink style={{ fontSize: "32px", fontWeight: "bold" }}
                        to="/register">
                        Register
                    </NavLink>
                </nav>
            </div>
        </div>
    );
}
