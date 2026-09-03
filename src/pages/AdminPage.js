/* eslint-disable no-undef */
import "../assets/css/advancedmarker.css";
import "../assets/css/ConnectPage.css";
import React, { useState, } from "react";
import { useParams } from "react-router-dom";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";
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
import { ParrotsImages } from "../components/Editors/ParrotsImages";
import { ReportsViewer } from "../components/Editors/ReportsViewer";
import { DirectMessagesViewer } from "../components/Editors/DirectMessagesViewer";
import { GroupMessagesViewer } from "../components/Editors/GroupMessagesViewer";
import { DeletedAccountsViewer } from "../components/Editors/DeletedAccountsViewer";


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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f0ece6" }}>
      <style>{`
        .admin-content::-webkit-scrollbar { display: none; }
        .admin-content { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* TOP NAV (replaces site header) */}
      <AdminSelector selected={adminView} setSelected={setAdminView} />

      {/* CONTENT */}
      <div
        className="admin-content"
        style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}
      >
        {adminView === "aiQueriesViewer" ? (
          <AiQueriesViewer />
        ) : adminView === "reportsViewer" ? (
          <ReportsViewer />
        ) : adminView === "directMessagesViewer" ? (
          <DirectMessagesViewer />
        ) : adminView === "groupMessagesViewer" ? (
          <GroupMessagesViewer />
        ) : adminView === "deletedAccountsViewer" ? (
          <DeletedAccountsViewer />
        ) : (
          <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
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
            {adminView === "aiMetrics" && <AiMetrics />}
            {adminView === "mobileVersionEditor" && <MobileVersionEditor />}
            {adminView === "parrotsImages" && <ParrotsImages />}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;




