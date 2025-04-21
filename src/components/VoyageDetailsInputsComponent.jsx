import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "../assets/css/CreateVehicle.css"
import "react-quill/dist/quill.snow.css"; // Import styles
import 'swiper/css';
import 'swiper/css/pagination';

export const VoyageDetailsInputsComponent = ({
    selectedVacancy,
    setSelectedVacancy,
    vehicleId,
    setVehicleId,
    vehiclesList,
    voyageName,
    setVoyageName,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    lastBidDate,
    setLastBidDate,
    isAuction,
    isFixedPrice,
    setIsAuction,
    setIsFixedPrice
}) => {




    const voyageDetails = {
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: "1.5rem",
        alignContent: "center",
        padding: ".2rem",
        transform: "scale(0.92)",
    }

    return (
        <div style={voyageDetails}>
            <div style={{
                backgroundColor: "rgba(255,255,255,0.7)"
            }}>
                <CreateVoyageVacancyPicker
                    selectedVacancy={selectedVacancy}
                    setSelectedVacancy={setSelectedVacancy}
                />
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                <CreateVoyageVehicleSelector
                    vehicleId={vehicleId}
                    setVehicleId={setVehicleId}
                    vehiclesList={vehiclesList}
                />
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                <CreateVoyagePageNameInput
                    voyageName={voyageName}
                    setVoyageName={setVoyageName}
                />
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.7)", }}>
                <CreateVoyagePriceInput
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    type={"Min Price"}
                />
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                <CreateVoyagePriceInput
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    type={"Max Price"}
                />
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
                <CreateVoyageLastBidDateInput
                    lastBidDate={lastBidDate}
                    setLastBidDate={setLastBidDate}
                />
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "1.5rem" }}>
                <AuctionFixedPrice
                    isAuction={isAuction}
                    isFixedPrice={isFixedPrice}
                    setIsAuction={setIsAuction}
                    setIsFixedPrice={setIsFixedPrice}
                />
            </div>
        </div>
    )
}

const CreateVoyagePageNameInput = ({ voyageName, setVoyageName }) => {
    return (
        <div style={{
            height: "4rem",
        }}>
            <div style={{
                margin: ".3rem"
            }}>
                <div
                    onClick={() => console.log("hello")}
                    style={{
                        display: "flex",
                        cursor: "pointer",
                        position: "relative",

                        marginTop: "0rem"
                    }}
                >
                    <span
                        className="text-lg font-bold"
                        style={labelStyle}
                    >
                        Name&nbsp;
                    </span>

                    <style>
                        {placeHolderStyle}
                    </style>
                    <input
                        className="font-bold text-base custom-input"
                        type="text"
                        placeholder="Voyage Name"
                        value={voyageName}
                        style={inputStyle}
                        onChange={(e) => setVoyageName(e.target.value)}
                    />
                </div>
            </div>
        </div >
    )
}

const CreateVoyageVehicleSelector = ({ vehicleId, setVehicleId, vehiclesList }) => {
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false); // State to toggle the dropdown visibility
    const dropdownRef = useRef(null); // Ref for the dropdown container
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside); // Add event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
        };
    }, []);

    return (
        <div style={{
            height: "4rem",
        }}>
            <div style={{
                margin: ".3rem"
            }}>
                <div
                    onClick={() => setOpen(!open)}
                    style={{
                        display: "flex",
                        cursor: "pointer",
                        position: "relative",
                        marginTop: "0rem"
                    }}
                >
                    <span
                        className="text-lg font-bold"
                        style={labelStyle}
                    >
                        Vehicle&nbsp;
                    </span>


                    <style>
                        {placeHolderStyle}
                    </style>
                    <input
                        className="font-bold text-base custom-input"
                        type="text"
                        readOnly
                        value={value}
                        placeholder="Select Vehicle"
                        style={inputStyle}
                    />
                    {open && (
                        <div
                            ref={dropdownRef}
                            style={{
                                position: "absolute",
                                zIndex: 1000,
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "1.5rem",
                                marginTop: "2.5rem",
                                width: "75%",
                                right: "0rem",
                                maxHeight: "53vh", // Optional: Limit height for large lists
                                overflowY: "auto", // Enable scrolling if content exceeds height
                                scrollbarWidth: "none", // For Firefox (hide scrollbar)
                                msOverflowStyle: "none", // For IE/Edge (hide scrollbar)
                                boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.3),
              inset 0 -4px 6px rgba(0, 0, 0, 0.3)
            `,
                            }}
                        >
                            <style>
                                {`
              .custom-dropdown::-webkit-scrollbar {
                display: none; 
              }
            `}
                            </style>

                            {vehiclesList.map((vehicle, index) => (
                                <div
                                    className="font-bold text-xl"
                                    key={index}
                                    onClick={() => {
                                        console.log(vehicle.value);
                                        setVehicleId(vehicle.value); // Set the selected vacancy
                                        setOpen(false); // Close the dropdown
                                        setValue(vehicle.label); // Close the dropdown
                                    }}
                                    style={{
                                        padding: ".5rem 1rem",
                                        cursor: "pointer",
                                        color: "black",
                                        boxShadow: `
                  inset 0 -3px 8px rgba(0, 0, 0, 0.05)
                `,
                                        borderBottom:
                                            index !== vehiclesList.length - 1 ? "1px solid #eee" : "none",
                                    }}
                                >
                                    {vehicle.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateVoyageLastBidDateInput = ({ lastBidDate, setLastBidDate }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const hoverTimeoutRef = useRef(null);
    const handleMouseEnter = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setShowDatePicker(true); // Only triggers if cursor stays for 2 sec
        }, 700);
    };
    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
    };

    return (
        <div style={{
            height: "4rem",
        }}>
            <div style={{
                margin: ".3rem"
            }}>
                <div
                    onClick={() => console.log("hello")}
                    style={{
                        display: "flex",
                        cursor: "pointer",
                        position: "relative",
                        marginTop: "0rem"
                    }}
                >
                    <span
                        className="text-lg font-bold"
                        style={labelStyle}
                    >
                        Last Bid Date&nbsp;
                    </span>

                    <style>
                        {placeHolderStyle}
                    </style>


                    {showDatePicker ? (
                        // Show Date Input when hovered
                        <input
                            className="font-bold text-base custom-input"
                            type="date"
                            value={lastBidDate || ""}
                            style={inputStyle}
                            onChange={(e) => setLastBidDate(e.target.value)}
                            // onMouseLeave={() => {
                            //     if (!lastBidDate) setShowDatePicker(false); // Hide if no date selected
                            // }}
                            autoFocus // Automatically focus when shown
                        />
                    ) : (
                        // Show Text Input initially
                        <input
                            className="font-bold text-base custom-input"
                            type="text"
                            placeholder="Bids close on..."
                            value={lastBidDate || ""}
                            style={{ ...inputStyle, color: "gray" }}
                            // onMouseEnter={() => setShowDatePicker(true)} // Switch to date picker on hover
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            readOnly
                        />
                    )}

                </div>
            </div>
        </div >
    )
}

const CreateVoyageVacancyPicker = ({ selectedVacancy, setSelectedVacancy }) => {
    const [open, setOpen] = useState(false); // State to toggle the dropdown visibility
    const dropdownRef = useRef(null); // Ref for the dropdown container
    const vacancies = Array.from({ length: 50 }, (_, index) => index + 1);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside); // Add event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
        };
    }, []);

    return (

        <div style={{
            height: "4rem",
        }}>

            <div style={{
                margin: ".3rem"
            }}>
                <div
                    onClick={() => setOpen(!open)}
                    style={{
                        display: "flex",
                        cursor: "pointer",
                        position: "relative",
                        marginTop: "0rem"
                    }}
                >
                    <span
                        className="text-lg font-bold"
                        style={labelStyle}
                    >
                        Vacancy&nbsp;
                    </span>


                    <style>
                        {placeHolderStyle}
                    </style>
                    <input
                        className="font-bold text-base custom-input"
                        type="text"
                        readOnly
                        value={selectedVacancy} // Display the selected vacancy number
                        placeholder="Max number of voyagers"
                        style={inputStyle}
                    />
                    {open && (
                        <div
                            ref={dropdownRef}
                            style={{
                                position: "absolute",
                                zIndex: 1000,
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "1.5rem",
                                marginTop: "2.5rem",
                                width: "75%",
                                right: "0rem",
                                maxHeight: "53vh", // Optional: Limit height for large lists
                                overflowY: "auto", // Enable scrolling if content exceeds height
                                scrollbarWidth: "none", // For Firefox (hide scrollbar)
                                msOverflowStyle: "none", // For IE/Edge (hide scrollbar)
                                boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.3),
              inset 0 -4px 6px rgba(0, 0, 0, 0.3)
            `,
                            }}
                        >
                            <style>
                                {`
              .custom-dropdown::-webkit-scrollbar {
                display: none; 
              }
            `}
                            </style>

                            {vacancies.map((vacancy, index) => (
                                <div
                                    className="font-bold text-xl"
                                    key={index}
                                    onClick={() => {
                                        setSelectedVacancy(vacancy); // Set the selected vacancy
                                        setOpen(false); // Close the dropdown
                                    }}
                                    style={{
                                        padding: ".5rem 1rem",
                                        cursor: "pointer",
                                        color: "black",

                                        boxShadow: `
                  inset 0 -3px 8px rgba(0, 0, 0, 0.05)
                `,

                                        borderBottom:
                                            index !== vacancies.length - 1 ? "1px solid #eee" : "none",
                                    }}
                                >
                                    {vacancy}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CreateVoyagePriceInput = ({ minPrice, setMinPrice, maxPrice, setMaxPrice, type }) => {
    return (
        <div style={{
            height: "4rem",
        }}>
            <div style={{
                margin: ".3rem"
            }}>
                <div
                    onClick={() => console.log("hello")}
                    style={{
                        display: "flex",
                        cursor: "pointer",
                        position: "relative",
                        marginTop: "0rem"
                    }}
                >
                    <span
                        className="text-lg font-bold"
                        style={labelStyle}
                    >
                        {type}&nbsp;
                    </span>
                    <style>
                        {placeHolderStyle}
                    </style>
                    <input
                        className="font-bold text-base custom-input"
                        type="number"
                        placeholder={type}
                        value={type === "Max Price" ? (maxPrice === null ? "" : maxPrice) : (minPrice === null ? "" : minPrice)}

                        style={inputStyle}
                        onChange={(e) => {
                            let newValue = e.target.value;
                            if (newValue.startsWith("0") && newValue.length > 1) {
                                newValue = newValue.slice(1);
                            }
                            if (newValue === "0" || newValue === "") {
                                newValue = null;
                            } else {
                                newValue = Number(newValue);
                            }
                            if (type === "Max Price") {
                                setMaxPrice(newValue);
                            } else {
                                setMinPrice(newValue);
                            }
                        }}
                    />
                </div>
            </div>
        </div >
    )
}

const AuctionFixedPrice = ({ isAuction, setIsAuction, isFixedPrice, setIsFixedPrice }) => {
    return (
        <div
            style={{
                height: "4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                borderRadius: "1.5rem",
            }}
        >
            <label
                className="text-lg font-bold"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "black",
                    cursor: "pointer",
                }}
            >
                Fixed Price
                <input
                    type="checkbox"
                    checked={isFixedPrice}
                    onChange={() => setIsFixedPrice(!isFixedPrice)}
                    style={{ width: "2rem", height: "2rem", accentColor: "#007bff" }}
                />
            </label>

            <label
                className="text-lg font-bold"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "black",
                    cursor: "pointer",
                }}
            >
                Auction
                <input
                    type="checkbox"
                    checked={isAuction}
                    onChange={() => setIsAuction(!isAuction)}
                    style={{ width: "2rem", height: "2rem", accentColor: "#007bff" }}
                />
            </label>
        </div>
    );
}

const inputStyle = {
    width: "72%",
    padding: ".3rem",
    border: "1px solid #ccc",
    borderRadius: "1.5rem",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: `
  0 4px 6px rgba(0, 0, 0, 0.1),
  inset 0 -4px 6px rgba(0, 0, 0, 0.1)
  `,
    height: "3rem",
    fontSize: "1.1rem",
    color: "#007bff",

}

const labelStyle = {
    width: "28%",
    display: "inline-block",
    textAlign: "end",
    alignSelf: "center",
    color: "black",
    fontSize: "1.3rem"
}

const placeHolderStyle = `
        .custom-input::placeholder {
          font-size: 1.0rem;
          color: gray !important;
        }
      `
