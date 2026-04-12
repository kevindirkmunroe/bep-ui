export function Banner() {
    return (
        <div style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#fff",
            color: "#D2492C",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                    src="/bep-logo-transparent.png"
                    alt="Logo"
                    style={{
                        height: "54px",
                        width: "auto",
                        objectFit: "contain"
                    }}
                />                <strong>BAY Event Promoter</strong>
            </div>

            <div>
                {/* later: user info / logout */}
            </div>
        </div>
    );
}
