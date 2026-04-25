import { useEffect, useState } from "react";

const images = [
    "/images/comedy-alternate.jpg",
    "/images/dance.jpg",
    "/images/food-alternative.jpg",
    "/images/.jpg",
    "/images/popup.jpg"
];

const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "90vh", // 👈 full page height
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
};

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "left",
    transition: "opacity 0.5s ease-in-out"
};

const captionStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "10%",
    left: "50px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "30px",
    fontWeight: "bold"
};

const slides = [
    { src: "/carousel/comedy-alternate.jpg", label: "Comedy Nights" },
    { src: "/carousel/cats-corner.jpg", label: "Dance Parties" },
    { src: "/carousel/food-alternative.jpg", label: "Food & Wine" },
    { src: "/carousel/cocktails.png", label: "Cocktails" },
    { src: "/carousel/popup.jpg", label: "Pop-up Events" }
];

export default function ImageCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000); // change every 3s

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={containerStyle}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={slides[index].src} style={imageStyle} />
                <div style={captionStyle}>
                    {slides[index].label}
                </div>
            </div>
        </div>
    );
}
