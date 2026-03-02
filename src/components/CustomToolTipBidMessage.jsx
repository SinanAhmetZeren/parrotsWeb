import { parrotTextDarkBlue } from "../styles/colors";


export function CustomToolTipBidMessage({ isHovered, message }) {
    return (
        isHovered && (
            <div
                style={{
                    position: "absolute",
                    // bottom: "0%",
                    // right: "0%",
                    transform: "translateX(0%)",
                    backgroundColor: "white",
                    color: parrotTextDarkBlue,
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    // whiteSpace: "nowrap",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    cursor: "pointer",
                    whiteSpace: "normal",   // allow multiple lines
                    wordBreak: "break-word",// break long words
                    maxWidth: "200px",      // optional: limit width

                }}
            >
                {message}

            </div>
        )
    )
}

