import { parrotTextDarkBlue } from "../styles/colors";


export function CustomToolTip({ isHovered, message }) {
    return (
        isHovered && (
            <div
                style={{
                    position: "absolute",
                    bottom: "120%",
                    left: "100%",
                    transform: "translateX(-100%)",
                    backgroundColor: "white",
                    color: parrotTextDarkBlue,
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                }}
            >
                {message}
                {message}
            </div>
        )
    )
}

