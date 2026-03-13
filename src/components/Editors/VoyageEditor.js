/* eslint-disable no-undef */
import "../../assets/css/advancedmarker.css";
import "../../assets/css/ConnectPage.css";
import { useState } from "react";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { parrotBlue, parrotDarkBlue, parrotPlaceholderGrey } from "../../styles/colors";
import { usePatchVoyageAdminMutation, useLazyGetVoyageByIdAdminQuery } from "../../slices/VoyageSlice";

export function VoyageEditor() {

  const [voyageId, setVoyageId] = useState("");
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patchVoyage] = usePatchVoyageAdminMutation();
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const [
    triggerGetVoyageByIdAdmin,
    {
      data,
      isLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useLazyGetVoyageByIdAdminQuery();

  const handlePatchVoyage = async () => {


    if (honeyPotValue) {
      console.warn("Bot detected – update blocked");
      return;
    }

    if (!voyageId) return;

    setSaving(true);
    const patchDoc = [
      { op: "replace", path: "/name", value: voyage.name },
      { op: "replace", path: "/brief", value: voyage.brief },
      { op: "replace", path: "/description", value: voyage.description },
      { op: "replace", path: "/vacancy", value: voyage.vacancy },
      { op: "replace", path: "/startDate", value: voyage.startDate },
      { op: "replace", path: "/endDate", value: voyage.endDate },
      { op: "replace", path: "/lastBidDate", value: voyage.lastBidDate },
      { op: "replace", path: "/minPrice", value: voyage.minPrice },
      { op: "replace", path: "/maxPrice", value: voyage.maxPrice },
      { op: "replace", path: "/currency", value: voyage.currency },
      { op: "replace", path: "/fixedPrice", value: voyage.fixedPrice },
      { op: "replace", path: "/auction", value: voyage.auction },
      { op: "replace", path: "/publicOnMap", value: voyage.publicOnMap },
      { op: "replace", path: "/isDeleted", value: voyage.isDeleted },
      // { op: "replace", path: "/vehicleId", value: voyage.vehicle?.id ?? null },
      // { op: "replace", path: "/vehicleType", value: voyage.vehicleType },
    ];

    // Filter undefined/null (if desired)
    const filteredPatchDoc = patchDoc.filter(
      (item) => item.value !== undefined && (item.value !== null || Array.isArray(item.value))
    );


    console.log("filtered patch doc: ", filteredPatchDoc);
    try {
      const response = await patchVoyage({ patchDoc: filteredPatchDoc, voyageId: voyage.id });
      console.log("patch v response: ", response);
      // console.log("patch v response success: ", response.data.success);
      if (response.data.success) {
        console.log("Voyage updated successfully");

      } else {
        alert("Failed to update voyage. Please try again.");
      }
    } catch (error) {
      console.error("Error", error);
    } finally {

      setSaving(false)
    }

  };



  const fetchVoyage = async () => {
    if (!voyageId) return;
    setLoading(true);
    try {
      const response = await triggerGetVoyageByIdAdmin(voyageId);
      const data = await response.data;
      console.log(data);
      setVoyage(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };




  const handleChange = (field, value) => {
    setVoyage({ ...voyage, [field]: value });
  };



  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  const defaultVoyage = {
    name: "",
    brief: "",
    description: "",
    vacancy: 0,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    lastBidDate: new Date().toISOString(),
    minPrice: 0,
    maxPrice: 0,
    currency: "",
    fixedPrice: false,
    auction: false,
    publicOnMap: false,
    confirmed: false,
    isDeleted: false,
    vehicle: { name: "", id: null },
  };

  const currentVoyage = voyage || defaultVoyage;


  return (
    (
      <div style={{
        padding: "20px", fontFamily: "Arial", fontSize: "1.2rem",
        width: "80%", backgroundColor: parrotDarkBlue,
        margin: "auto", marginTop: "2rem"
      }}>

        <input
          type="text"
          value={honeyPotValue}
          onChange={(e) => setHoneyPotValue(e.target.value)}
          style={{ display: "none" }}
          autoComplete="off"
        />

        <div style={{ marginBottom: "20px" }}>
          <div style={rowStyle}>
            <div style={labelStyle}>Voyage Id</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                type="number"
                placeholder="Enter Voyage ID"
                value={voyageId}
                onChange={(e) => setVoyageId(e.target.value)}
                style={{ padding: "8px", marginRight: "10px", color: "darkblue", marginLeft: "0" }}
              />
              <div style={{ ...inputWrapper1, backgroundColor: "purple" }}>
                <button onClick={fetchVoyage} style={{ padding: "8px 16px", width: "15rem" }}>
                  {loading ? "Loading..." : "Fetch Voyage"}
                </button>
              </div>
              <div style={{ ...inputWrapper1, backgroundColor: "blue", marginLeft: "1rem" }}>
                {/* <button onClick={() => handlePatchVoyage()} style={{ padding: "8px 16px", width: "15rem", }}>
                  {saving ? "Saving..." : "Save"}
                </button> */}

                <button
                  onClick={handlePatchVoyage}
                  disabled={!voyage || saving}
                  style={{
                    padding: "8px 16px",
                    width: "15rem",
                    opacity: !voyage ? 0.5 : 1,
                    cursor: !voyage ? "not-allowed" : "pointer"
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

              </div>


            </div>
          </div>
        </div>
        {currentVoyage && (
          <div>
            {/* Name */}
            <div style={rowStyle}>
              <div style={labelStyle}>Name</div>
              <div style={inputWrapper}>
                <input
                  type="text"
                  value={currentVoyage.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Brief */}
            <div style={rowStyle}>
              <div style={labelStyle}>Brief</div>
              <div style={inputWrapper}>
                <textarea
                  value={currentVoyage.brief}
                  onChange={(e) => handleChange("brief", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Description */}
            <div style={rowStyle}>
              <div style={labelStyle}>Description</div>
              <div style={inputWrapper}>
                <textarea
                  value={currentVoyage.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Vacancy */}
            <div style={rowStyle}>
              <div style={labelStyle}>Vacancy</div>
              <div style={inputWrapper}>
                <input
                  type="number"
                  value={currentVoyage.vacancy}
                  onChange={(e) => handleChange("vacancy", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Dates */}
            <div style={{ display: "flex", gap: "10px", paddingBottom: "1.1rem", width: "90%", margin: "auto" }}>
              {["startDate", "endDate", "lastBidDate"].map((field) => (
                <div key={field} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                  <div style={labelStyle}>{field === "lastBidDate" ? "Last Bid" : field === "startDate" ? "Start Date" : "End Date"}</div>
                  <div style={inputWrapper}>
                    <input
                      type="datetime-local"
                      value={new Date(currentVoyage[field]).toISOString().slice(0, 16)}
                      onChange={(e) => handleChange(field, e.target.value)}
                      style={{ width: "100%", paddingLeft: "1rem" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Prices */}
            <div style={{ display: "flex", color: "darkblue", gap: "10px", paddingBottom: "1.1rem", width: "90%", margin: "auto" }}>
              {["minPrice", "maxPrice", "currency"].map((field) => (
                <div key={field} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                  <div style={labelStyle}>{field === "minPrice" ? "Min Price" : field === "maxPrice" ? "Max Price" : "Currency"}</div>
                  <div style={inputWrapper}>
                    <input
                      type={field.includes("Price") ? "number" : "text"}
                      value={currentVoyage[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      style={{ width: "100%", paddingLeft: "1rem" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Boolean Fields */}
            <div style={{ display: "flex", gap: "10px", margin: "auto", marginBottom: "20px", justifyContent: "space-between", width: "90%" }}>
              {["fixedPrice", "auction", "publicOnMap", "confirmed", "isDeleted"].map((field) => (
                <button
                  key={field}
                  onClick={() => setVoyage({ ...voyage, [field]: !currentVoyage[field] })}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: currentVoyage[field] ? "green" : "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "18rem",
                  }}
                >
                  {field}: {currentVoyage[field] ? "true" : "false"}
                </button>
              ))}
            </div>

            {/* Vehicle */}
            <div style={{ display: "flex", gap: "10px", width: "90%", margin: "auto", marginBottom: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Vehicle Name</div>
                <div style={inputWrapper}>
                  <input
                    value={currentVoyage.vehicle?.name || ""}
                    style={{ width: "100%", color: parrotPlaceholderGrey }}
                    onChange={(e) => console.log(e)}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Vehicle Id</div>
                <div style={inputWrapper}>
                  <input
                    type="number"
                    value={currentVoyage.vehicle?.id || ""}
                    onChange={(e) => console.log(e)}
                    style={{ width: "100%", color: parrotPlaceholderGrey }}
                  />
                </div>
              </div>
            </div>
          </div>


        )}
      </div>

    )
  );
}


const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 6fr",
  width: "90%",
  margin: "auto",
  gap: "4px",
  marginBottom: "10px"
};

const labelStyle = {
  backgroundColor: parrotBlue,
  color: "white",
  // padding: "8px"
};

const inputWrapper = {
  backgroundColor: parrotDarkBlue,
  color: "darkblue",
  // padding: "8px"
};

const inputWrapper1 = {
  backgroundColor: parrotBlue,
  color: "white",
  // padding: "8px",

};

const inputStyle = {
  width: "100%",
  paddingLeft: "1rem"
}