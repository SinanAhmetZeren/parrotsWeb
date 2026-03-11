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
import { usePatchVoyageAdminMutation } from "../../slices/VoyageSlice";
import { useLazyGetVehicleByIdAdminQuery, usePatchVehicleAdminMutation } from "../../slices/VehicleSlice";


export function VehicleEditor() {

  const [vehicleId, setVehicleId] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const [patchVehicleAdmin] = usePatchVehicleAdminMutation();
  const [triggerGetVehicleById] = useLazyGetVehicleByIdAdminQuery();

  const formatDateForInput = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    return d.toISOString().slice(0, 16);
  };

  const handlePatchVehicle = async () => {

    if (honeyPotValue) {
      console.warn("Bot detected – update blocked");
      return;
    }

    if (!vehicle?.id) return;

    setSaving(true);

    const patchDoc = [
      { op: "replace", path: "/name", value: vehicle.name },
      { op: "replace", path: "/capacity", value: vehicle.capacity },
      { op: "replace", path: "/description", value: vehicle.description },
      { op: "replace", path: "/userId", value: vehicle.userId },
      { op: "replace", path: "/createdAt", value: vehicle.createdAt },
      { op: "replace", path: "/confirmed", value: vehicle.confirmed },
      { op: "replace", path: "/isDeleted", value: vehicle.isDeleted },
    ];

    const filteredPatchDoc = patchDoc.filter(
      (item) => item.value !== undefined && (item.value !== null || Array.isArray(item.value))
    );

    console.log(filteredPatchDoc);

    try {
      console.log("vehicle: ", vehicle);
      const response = await patchVehicleAdmin({
        patchDoc: filteredPatchDoc,
        vehicleId: vehicle.id,
      });

      console.log("response: ", response);

      if (response.data.success) {
        console.log("Vehicle updated successfully");
      }
      else {
        alert("Vehicle update failed");
      }

    }
    catch (err) {
      console.error(err);
    }
    finally {
      setSaving(false);
    }
  };


  const fetchVehicle = async () => {

    if (!vehicleId) return;

    setLoading(true);

    try {

      const response = await triggerGetVehicleById(vehicleId);

      const data = response.data;

      console.log("vehicle: ", data);

      setVehicle(data);

    }
    catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };


  const handleChange = (field, value) => {
    setVehicle({ ...vehicle, [field]: value });
    console.log("vehicle after changes: ", vehicle);
  };


  const defaultVehicle = {
    name: "",
    capacity: 0,
    description: "",
    userId: "",
    createdAt: new Date().toISOString(),
    confirmed: false,
    isDeleted: false
  };

  const currentVehicle = vehicle || defaultVehicle;


  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      width: "80%",
      margin: "auto",
      marginTop: "2rem",
      backgroundColor: parrotDarkBlue
    }}>


      <input
        type="text"
        value={honeyPotValue}
        onChange={(e) => setHoneyPotValue(e.target.value)}
        style={{ display: "none" }}
      />

      {/* VEHICLE ID */}

      <div style={rowStyle}>

        <div style={labelStyle}>Vehicle Id</div>

        <div style={{ display: "flex", gap: "10px" }}>

          <input
            type="number"
            value={vehicleId}
            placeholder="Vehicle Id"
            onChange={(e) => setVehicleId(e.target.value)}
            style={{ padding: "8px", color: "darkblue" }}
          />
          <div style={{ ...inputWrapper1, backgroundColor: "purple", width: "12rem" }}>

            <button onClick={fetchVehicle} style={{ height: "3.5rem" }}>
              {loading ? "Loading..." : "Fetch Vehicle"}
            </button>
          </div>
          <div style={{ ...inputWrapper1, backgroundColor: "peru", width: "12rem" }}>

            <button
              style={{ height: "3.5rem" }}
              onClick={handlePatchVehicle}
              disabled={!vehicle || saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

        </div>

      </div>


      {currentVehicle && (

        <>

          {/* NAME */}

          <div style={rowStyle}>
            <div style={labelStyle}>Name</div>
            <div style={inputWrapper}>
              <input
                value={currentVehicle.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>


          {/* CAPACITY */}

          <div style={rowStyle}>
            <div style={labelStyle}>Capacity</div>
            <div style={inputWrapper}>
              <input
                type="number"
                value={currentVehicle.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                // onChange={(e) => handleChange("capacity", parseInt(e.target.value, 10) || 0)}
                style={inputStyle}
              />
            </div>
          </div>


          {/* DESCRIPTION */}

          <div style={rowStyle}>
            <div style={labelStyle}>Description</div>
            <div style={inputWrapper}>
              <textarea
                value={currentVehicle.description}
                onChange={(e) => handleChange("description", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>


          {/* USER ID */}

          <div style={rowStyle}>
            <div style={labelStyle}>User Id</div>
            <div style={inputWrapper}>
              <input
                value={currentVehicle.userId}
                onChange={(e) => handleChange("userId", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>


          {/* CREATED AT */}

          <div style={rowStyle}>
            <div style={labelStyle}>Created At</div>
            <div style={inputWrapper}>

              <input
                type="datetime-local"
                value={formatDateForInput(currentVehicle.createdAt)}
                onChange={(e) => handleChange("createdAt", e.target.value)}
                style={inputStyle}
              />

            </div>
          </div>




          {/* BOOLEAN BUTTONS */}

          <div style={{
            display: "flex",
            gap: "10px",
            width: "90%",
            margin: "auto",
            marginTop: "20px",
            justifyContent: "center"
          }}>

            {["confirmed", "isDeleted"].map((field) => (

              <button
                key={field}
                onClick={() =>
                  setVehicle({
                    ...vehicle,
                    [field]: !currentVehicle[field]
                  })
                }
                style={{
                  padding: "8px 12px",
                  backgroundColor: currentVehicle[field] ? "green" : "red",
                  color: "white",
                  border: "none",
                  width: "20rem"
                }}
              >

                {field}: {currentVehicle[field] ? "true" : "false"}

              </button>

            ))}

          </div>

        </>
      )}

    </div>
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