/* eslint-disable no-undef */
import "../../assets/css/advancedmarker.css";
import "../../assets/css/ConnectPage.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TopBarMenu } from "../TopBarMenu";
import { TopLeftComponent } from "../TopLeftComponent";
import { useNavigate, useParams } from "react-router-dom";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { useLazyGetVoyageByIdAdminQuery } from "../../slices/VoyageSlice";
import { parrotBlue, parrotDarkBlue, parrotGreyTransparent, parrotPlaceholderGrey, parrotTextDarkBlue } from "../../styles/colors";
import { usePatchVoyageMutation } from "../../slices/VoyageSlice";


export function VoyageEditor() {
  useParams();
  const currentUserId = localStorage.getItem("storedUserId");
  const navigate = useNavigate();
  const [voyageId, setVoyageId] = useState("");
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patchVoyage] = usePatchVoyageMutation();

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



  return (
    (



      <div style={{
        padding: "20px", fontFamily: "Arial", fontSize: "1.2rem",
        width: "80%", backgroundColor: parrotDarkBlue,
        margin: "auto", marginTop: "2rem"
      }}>
        <h3 style={{ marginBottom: "2rem" }}>Voyage Editor</h3>
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
        {voyage && (
          <div>
            {/* Name */}
            <div style={rowStyle}>
              <div style={labelStyle}>Name</div>
              <div style={inputWrapper}>
                <input
                  type="text"
                  value={voyage.name}
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
                  value={voyage.brief}
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
                  value={voyage.description}
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
                  value={voyage.vacancy}
                  onChange={(e) => handleChange("vacancy", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{
              display: "flex", gap: "10px",
              paddingBottom: "1.1rem", width: "90%", margin: "auto"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Start Date</div>
                <div style={inputWrapper}>
                  <input
                    type="datetime-local"
                    value={new Date(voyage.startDate).toISOString().slice(0, 16)}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    style={{ width: "100%", paddingLeft: "1rem" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>End Date</div>
                <div style={inputWrapper}>
                  <input
                    type="datetime-local"
                    value={new Date(voyage.endDate).toISOString().slice(0, 16)}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    style={{ width: "100%", paddingLeft: "1rem" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Last Bid  </div>
                <div style={inputWrapper}>
                  <input
                    type="datetime-local"
                    value={new Date(voyage.lastBidDate).toISOString().slice(0, 16)}
                    onChange={(e) => handleChange("lastBidDate", e.target.value)}
                    style={{ width: "100%", paddingLeft: "1rem" }}
                  />
                </div>
              </div>
            </div>



            <div style={{
              display: "flex", color: "darkblue",
              gap: "10px", paddingBottom: "1.1rem", width: "90%", margin: "auto"
            }}>
              {/* Min Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Min Price</div>
                <div style={inputWrapper}>
                  <input
                    type="number"
                    value={voyage.minPrice}
                    onChange={(e) => handleChange("minPrice", e.target.value)}
                    style={{ width: "100%", paddingLeft: "1rem" }}
                  />
                </div>
              </div>

              {/* Max Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Max Price</div>
                <div style={inputWrapper}>
                  <input
                    type="number"
                    value={voyage.maxPrice}
                    onChange={(e) => handleChange("maxPrice", e.target.value)}
                    style={{ width: "100%", paddingLeft: "1rem" }}
                  />
                </div>
              </div>

              {/* Currency */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Currency</div>
                <div style={inputWrapper}>
                  <input
                    value={voyage.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    style={{ width: "100%", paddingLeft: "1rem" }}
                  />
                </div>
              </div>
            </div>


            {/* Boolean Fields */}
            <div style={{
              display: "flex", gap: "10px",
              margin: "auto", marginBottom: "20px", justifyContent: "space-between", width: "90%",
            }}>
              {["fixedPrice", "auction", "publicOnMap", "confirmed", "isDeleted"].map((field) => (
                <button
                  key={field}
                  onClick={() => setVoyage({ ...voyage, [field]: !voyage[field] })}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: voyage[field] ? "green" : "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "18rem",
                  }}
                >
                  {field}: {voyage[field] ? "true" : "false"}
                </button>
              ))}
            </div>


            <div style={{ display: "flex", gap: "10px", width: "90%", margin: "auto", marginBottom: "20px" }}>
              {/* Vehicle Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Vehicle Name</div>
                <div style={inputWrapper}>
                  <input
                    value={voyage.vehicle?.name || ""}
                    style={{ width: "100%", color: parrotPlaceholderGrey }}
                    onChange={(e) => console.log(e)}


                  />
                </div>
              </div>

              {/* Vehicle Id */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", flex: 1 }}>
                <div style={labelStyle}>Vehicle Id</div>
                <div style={inputWrapper}>
                  <input
                    type="number"
                    value={voyage.vehicle?.id || ""}
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
  padding: "8px"
};

const inputWrapper = {
  backgroundColor: parrotDarkBlue,
  color: "darkblue",
  padding: "8px"
};

const inputWrapper1 = {
  backgroundColor: parrotBlue,
  color: "white",
  padding: "8px",

};

const inputStyle = {
  width: "100%",
  paddingLeft: "1rem"
}