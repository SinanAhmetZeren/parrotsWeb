

export const MapTypeButton = ({ mapTypeId, setMapTypeId }) => {
    return (

        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1,
        }}>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent map click
                    setMapTypeId(prev => prev === "roadmap" ? "hybrid" : "roadmap");
                }}
                style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '4rem',
                    backgroundColor: 'white',
                    border: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}
                title="Toggle Map Style"
            >
                {/* You can use a small icon here */}
                {mapTypeId === "roadmap" ? "🛰️" : "🗺️"}
            </button>
        </div>

    )

};
