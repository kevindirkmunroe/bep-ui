import { useEffect, useState } from "react";

const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "90vh", // 👈 full page height
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
};

const imageWrapper: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%"
};

const imageStyle: React.CSSProperties = {
    position: "absolute",   // 👈 stack images
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 1.2s ease-in-out" // 👈 smooth dissolve
};

const slides = [
    { src: "/carousel/comedy-alternate.jpg", label: "Comedy Nights" },
    { src: "/carousel/cats-corner.jpg", label: "Dance Parties" },
    { src: "/carousel/food-alternative.jpg", label: "Food & Wine" },
    { src: "/carousel/wine.jpg", label: "Wine Bars" },
    { src: "/carousel/cocktails.png", label: "Cocktails" },
    { src: "/carousel/popup.jpg", label: "Pop-up Events" }
];

export default function ImageCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => {
                return (prev + 1) % slides.length;
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={containerStyle}>
            <div style={imageWrapper}>
                {slides.map((slide, i) => (
                    <img
                        key={i}
                        src={slide.src}
                        style={{
                            ...imageStyle,
                            opacity: i === index ? 1 : 0,
                            zIndex: i === index ? 1 : 0
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
