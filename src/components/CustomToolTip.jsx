import { parrotTextDarkBlue } from "../styles/colors";


export function CustomToolTip({ isHovered, message, offsetLeft = "50%", direction = "up" }) {
    return (
        isHovered && (
            <div
                style={{
                    position: "absolute",
                    ...(direction === "down"
                        ? { top: "calc(100% + 6px)" }
                        : { bottom: "calc(100% + 8px)" }),
                    left: offsetLeft,
                    transform: "translateX(-50%)",
                    backgroundColor: "white",
                    color: parrotTextDarkBlue,
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
            >
                {message}
            </div>
        )
    )
}

