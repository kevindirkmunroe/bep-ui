export default function ImageGrid() {
    const images = [
        "/carousel/cats-corner.jpg",
        "/carousel/cside-funny.jpg",
        "/carousel/comedy.jpg",
        "/carousel/hausa-vegan.jpg",
        "/carousel/function.jpg",
        "/carousel/cosmo-alleycats.jpg",
        "/carousel/popup-manny.jpg",
        "/carousel/kareoke.jpg"
    ];

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // 👈 4 columns
        gap: "12px",
        padding: "16px"
    };

    const imageStyle: React.CSSProperties = {
        width: "100%",
        height: "140px",
        objectFit: "cover", // 👈 fills cell, crops nicely
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    };

    return (
        <div style={gridStyle}>
            {images.map((src, i) => (
                <img key={i} src={src} style={imageStyle} />
            ))}
        </div>
    );
}
