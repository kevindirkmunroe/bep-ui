import {useEffect, useState} from "react";


const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 👈 4 columns
    gap: "12px",
    padding: "16px"
};

const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    transition: "opacity 1.5s ease-in-out"
};

export default function ImageGrid() {
    const initialImages = [
        "/carousel/cats-corner.jpg",
        "/carousel/cside-funny.jpg",
        "/carousel/comedy.jpg",
        "/carousel/hausa-vegan.jpg",
        "/carousel/function.jpg",
        "/carousel/cosmo-alleycats.jpg",
        "/carousel/popup-manny.jpg",
        "/carousel/kareoke.jpg"
    ];

    const [images, setImages] = useState(initialImages);

    const shuffle = (arr: string[]) => {
        return [...arr].sort(() => Math.random() - 0.5);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setImages((prev) => shuffle(prev));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={gridStyle}>
            {images.map((src, i) => (
                <img key={i} src={src} style={imageStyle} />
            ))}
        </div>
    );
}
