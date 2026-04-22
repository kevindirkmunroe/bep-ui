import { useEffect } from "react";

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modalStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    width: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

export default function Modal({ children, onClose }) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div
                style={modalStyle}
                onClick={(e) => e.stopPropagation()} // 👈 prevent close when clicking inside
            >
                {children}
            </div>
        </div>
    );
}
