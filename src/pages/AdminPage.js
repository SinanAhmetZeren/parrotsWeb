/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { useNavigate, useParams } from "react-router-dom";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { parrotBlue, parrotDarkBlue, } from "../styles/colors";
import { VoyageEditor } from "../components/Editors/VoyageEditor";
import AdminSelector from "../components/AdminSelector";
import { BidEditor } from "../components/Editors/BidEditor";
import { UserEditor } from "../components/Editors/UserEditor";
import { VehicleEditor } from "../components/Editors/VehicleEditor";
import { TermsEditor } from "../components/Editors/TermsEditor";
import { WeeklyPurchasesMetrics } from "../components/Metrics/PurchasesMetrics";
import { WeeklyTransactionsMetrics } from "../components/Metrics/TransactionsMetrics";
import { WeeklyVoyagesMetrics } from "../components/Metrics/VoyagesMetrics";
import { WeeklyVehiclesMetrics } from "../components/Metrics/VehiclesMetrics";
import { WeeklyUsersMetrics } from "../components/Metrics/UsersMetrics";
import { WeeklyBidsMetrics } from "../components/Metrics/BidsMetrics";
import { WeeklyMessagesMetrics } from "../components/Metrics/MessagesMetrics";
import { LogViewer } from "../components/Editors/LogViewer";
import { PlaceEditor } from "../components/Editors/PlaceEditor";
import { PlaceEditorEdit } from "../components/Editors/PlaceEditorEdit";
import { DocsViewer } from "../components/Editors/DocsViewer";
import { AiQueriesViewer } from "../components/Editors/AiQueriesViewer";
import { AiMetrics } from "../components/Metrics/AiMetrics";
import { MobileVersionEditor } from "../components/Editors/MobileVersionEditor";


function AdminPage() {
  useParams();
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
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                gap: 0
              }}
            >
              {/* LEFT SELECTOR */}
              <div style={{ width: "9rem" }}>
                <AdminSelector selected={adminView} setSelected={setAdminView} />
              </div>

              {/* RIGHT PAGE */}

              <div
                style={{
                  flex: 1,
                  padding: 0,
                  overflowY: "scroll",
                  height: "92vh",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",

                }}
                className="hide-scrollbar"
              >

                <style>
                  {`
      .hide-scrollbar {
        scrollbar-width: none;      /* Firefox */
        -ms-overflow-style: none;   /* IE/Edge */
      }

      .hide-scrollbar::-webkit-scrollbar {
        display: none;              /* Chrome/Safari */
      }
    `}
                </style>

                {adminView === "voyageEditor" && <VoyageEditor />}
                {adminView === "bidEditor" && <BidEditor />}
                {adminView === "vehicleEditor" && <VehicleEditor />}
                {adminView === "userEditor" && <UserEditor />}
                {adminView === "termsEditor" && <TermsEditor />}
                {adminView === "purchases" && <WeeklyPurchasesMetrics />}
                {adminView === "transactions" && <WeeklyTransactionsMetrics />}
                {adminView === "voyagesCreated" && <WeeklyVoyagesMetrics />}
                {adminView === "vehiclesRegistered" && <WeeklyVehiclesMetrics />}
                {adminView === "usersCreated" && <WeeklyUsersMetrics />}
                {adminView === "bidsCreated" && <WeeklyBidsMetrics />}
                {adminView === "messaging" && <WeeklyMessagesMetrics />}
                {adminView === "logViewer" && <LogViewer />}
                {adminView === "placeEditor" && <PlaceEditor />}
                {adminView === "placeEditorEdit" && <PlaceEditorEdit />}
                {adminView === "docsViewer" && <DocsViewer />}
                {adminView === "aiQueriesViewer" && <AiQueriesViewer />}
                {adminView === "aiMetrics" && <AiMetrics />}
                {adminView === "mobileVersionEditor" && <MobileVersionEditor />}
              </div>
            </div>


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