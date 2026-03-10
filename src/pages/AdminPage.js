/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useNavigate, useParams } from "react-router-dom";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { useLazyGetVoyageByIdAdminQuery } from "../slices/VoyageSlice";
import { parrotBlue, parrotDarkBlue, parrotGreyTransparent, parrotPlaceholderGrey, parrotTextDarkBlue } from "../styles/colors";
import { usePatchVoyageMutation } from "../slices/VoyageSlice";
import { VoyageEditor } from "../components/Editors/VoyageEditor";
import AdminSelector from "../components/AdminSelector";
import { BidEditor } from "../components/Editors/BidEditor";


function AdminPage() {
  useParams();
  const currentUserId = localStorage.getItem("storedUserId");
  const navigate = useNavigate();
  const [voyageId, setVoyageId] = useState("");
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patchVoyage] = usePatchVoyageMutation();
  const [adminView, setAdminView] = useState("voyageEditor");


  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }



  return (
    (

      <div className="App">
        <header className="App-header">
          <div className="flex mainpage_Container">
            <div className="flex mainpage_TopRow">
              <TopLeftComponent />
              <div className="flex mainpage_TopRight">
                <TopBarMenu />
              </div>
            </div>




            <AdminSelector selected={adminView} setSelected={setAdminView} />

            {adminView === "voyageEditor" && <VoyageEditor />}
            {adminView === "bidEditor" && <BidEditor />}
            {/*adminView === "vehicleEditor" && <VehicleEditor />}
            {adminView === "userEditor" && <UserEditor />} */}


          </div>
        </header>
      </div>
    )
  );
}

export default AdminPage;




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