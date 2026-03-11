/* eslint-disable no-undef */
import "../../assets/css/advancedmarker.css";
import "../../assets/css/ConnectPage.css";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TopBarMenu } from "../TopBarMenu";
import { TopLeftComponent } from "../TopLeftComponent";
import { useNavigate, useParams } from "react-router-dom";
import { SomethingWentWrong } from "../SomethingWentWrong";
import { useHealthCheckQuery } from "../../slices/HealthSlice";
import { useLazyGetBidsByUserIdQuery, useLazyGetBidsByVoyageIdQuery, usePatchBidMutation, usePatchVoyageAdminMutation } from "../../slices/VoyageSlice";
import { parrotBlue, parrotDarkBlue, parrotGreyTransparent, parrotPlaceholderGrey, parrotTextDarkBlue } from "../../styles/colors";


export function BidEditor() {
  useParams();
  const currentUserId = localStorage.getItem("storedUserId");
  const navigate = useNavigate();
  const [voyageId, setVoyageId] = useState("");
  const [bidUserId, setBidUserId] = useState("");
  const [voyage, setVoyage] = useState(null);
  const [bids, setBids] = useState([]);
  const [honeyPotValue, setHoneyPotValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patchBid] = usePatchBidMutation();

  const [
    triggerGetBidsByUserId,
    {
      data: userBidsData,
      isLoading: isUserBidsLoading,
      isError: isUserBidsError,
      error: userBidsError,
      isSuccess: isUserBidsSuccess,
    },
  ] = useLazyGetBidsByUserIdQuery();

  const [
    triggerGetBidsByVoyageId,
    {
      data: voyageBidsData,
      isLoading: isVoyageBidsLoading,
      isError: isVoyageBidsError,
      error: voyageBidsError,
      isSuccess: isVoyageBidsSuccess,
    },
  ] = useLazyGetBidsByVoyageIdQuery();



  const updateBidField = (bidId, field, value) => {
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid.id === bidId
          ? { ...bid, [field]: field === "offerPrice" || field === "personCount" ? Number(value) : value }
          : bid
      )
    );
  };

  const toggleAccepted = (bidId) => {
    setBids((prevBids) =>
      prevBids.map((bid) =>
        bid.id === bidId ? { ...bid, accepted: !bid.accepted } : bid
      )
    );
  };



  const handleFetchBidsByVoyageId = async () => {
    if (!voyageId) return;
    setLoading(true);
    try {
      const response = await triggerGetBidsByVoyageId(voyageId);
      const data = await response.data;
      console.log(data);
      setBids(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBidsByUserId = async () => {
    if (!bidUserId) return;
    setLoading(true);
    try {
      const response = await triggerGetBidsByUserId(bidUserId);
      const data = await response.data;
      console.log(data);
      setBids(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };




  const handlePatchBid = async (bidId) => {


    if (honeyPotValue) {
      console.warn("Bot detected – update blocked");
      return;
    }

    if (!bidId) return;
    console.log("patch bid id: ", bidId);
    const bid = bids.find((b) => b.id === bidId);

    setSaving(bidId);

    const patchDoc = [
      { op: "replace", path: "/personCount", value: bid.personCount },
      { op: "replace", path: "/message", value: bid.message },
      { op: "replace", path: "/offerPrice", value: bid.offerPrice },
      { op: "replace", path: "/accepted", value: bid.accepted },
      // Add more fields here if your Bid model has others, e.g. currency, date, etc.
    ];

    // Filter out undefined/null values if desired
    const filteredPatchDoc = patchDoc.filter(
      (item) => item.value !== undefined && (item.value !== null || Array.isArray(item.value))
    );

    console.log("filtered patch doc for bid: ", filteredPatchDoc);

    try {
      const response = await patchBid({ patchDoc: filteredPatchDoc, bidId: bid.id });
      console.log("patch bid response: ", response);

      if (response.data.success) {
        console.log("Bid updated successfully");
        // Optionally refresh bid list or state here
      } else {
        alert("Failed to update bid. Please try again.");
      }
    } catch (error) {
      console.error("Error patching bid:", error);
    } finally {
      setSaving(null);
    }
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
                <button onClick={handleFetchBidsByVoyageId} style={{ padding: "8px 16px", width: "18rem" }}>
                  {loading ? "Loading..." : "Fetch Bids by Voyage Id"}
                </button>
              </div>

            </div>
          </div>
          <div style={rowStyle}>
            <div style={labelStyle}>User Id</div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <input
                type="text"
                placeholder="Enter User ID"
                value={bidUserId}
                onChange={(e) => setBidUserId(e.target.value)}
                style={{ padding: "8px", marginRight: "10px", color: "darkblue", marginLeft: "0" }}
              />
              <div style={{ ...inputWrapper1, backgroundColor: "purple" }}>
                <button onClick={handleFetchBidsByUserId} style={{ padding: "8px 16px", width: "18rem" }}>
                  {loading ? "Loading..." : "Fetch Bids by User Id"}
                </button>
              </div>

            </div>
          </div>
        </div>
        <input
          type="text"
          value={honeyPotValue}
          onChange={(e) => setHoneyPotValue(e.target.value)}
          style={{ display: "none" }}
          autoComplete="off"
        />

        <div style={{ padding: "20px", width: "95%", margin: "auto", fontFamily: "Arial" }}>
          <h3 style={{ marginBottom: "1rem", color: "#0d47a1" }}>Bids</h3>
          <div
            key={"bid id"}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
              backgroundColor: "#1976d2",
              borderRadius: "6px",
              color: "white",
              fontSize: "0.9rem",
              marginBottom: ".5rem"
            }}
          >
            {/* ID */}
            <div style={{ flex: "0 0 40px" }}>

              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                Bid Id
              </button>

            </div>

            {/* Accepted */}
            <div style={{ flex: "0 0 60px" }}>
              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                accepted
              </button>
            </div>

            {/* OfferPrice */}
            <div style={{ flex: "0 0 80px" }}>
              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                Offer Price
              </button>
            </div>

            {/* PersonCount */}
            <div style={{ flex: "0 0 60px" }}>
              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                persons
              </button>
            </div>

            {/* Message */}
            <div style={{ flex: "1 1 200px" }}>
              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                Message
              </button>
            </div>

            {/* User */}
            <div style={{ flex: "0 0 120px" }}>

              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                username
              </button>
            </div>

            {/* Voyage */}
            <div style={{ flex: "0 0 120px" }}>
              <button
                onClick={() => console.log("")}
                style={{
                  width: "100%",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  padding: "2px 0",
                }}
              >
                Voyage name
              </button>

            </div>

            {/* Save Button */}
            <div style={{ flex: "0 0 60px", opacity: "0" }}>
              <button
                onClick={() => console.log("")}
                style={{ width: "100%", backgroundColor: "#0d47a1", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", padding: "2px 0" }}
              >
                Save
              </button>
            </div>
          </div>

          {bids && bids.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "blue" }}>
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    backgroundColor: "#1976d2",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  {/* ID */}
                  <div style={{ flex: "0 0 40px" }}>
                    <input value={bid.id} disabled
                      style={{ width: "100%", border: "none", borderRadius: "4px", padding: "2px", color: "white" }} />
                  </div>

                  {/* Accepted */}
                  <div style={{ flex: "0 0 60px" }}>
                    <button
                      onClick={() => toggleAccepted(bid.id)}
                      style={{
                        width: "100%",
                        backgroundColor: bid.accepted ? "green" : "red",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        padding: "2px 0",
                      }}
                    >
                      {bid.accepted ? "✔" : "✖"}
                    </button>
                  </div>

                  {/* OfferPrice */}
                  <div style={{ flex: "0 0 80px" }}>
                    <input
                      type="number"
                      value={bid.offerPrice}
                      onChange={(e) => updateBidField(bid.id, "offerPrice", e.target.value)}
                      style={{ width: "100%", borderRadius: "4px", padding: "2px", color: "blue" }}
                      placeholder="Offer"
                    />
                  </div>

                  {/* PersonCount */}
                  <div style={{ flex: "0 0 60px" }}>
                    <input
                      type="number"
                      value={bid.personCount}
                      onChange={(e) => updateBidField(bid.id, "personCount", e.target.value)}
                      style={{ width: "100%", borderRadius: "4px", padding: "2px", color: "blue" }}
                      placeholder="Persons"
                    />
                  </div>

                  {/* Message */}
                  <div style={{ flex: "1 1 200px" }}>
                    <input
                      type="text"
                      value={bid.message}
                      onChange={(e) => updateBidField(bid.id, "message", e.target.value)}
                      style={{ width: "100%", borderRadius: "4px", padding: "2px", color: "blue" }}
                      placeholder="Message"
                    />
                  </div>

                  {/* User */}
                  <div style={{ flex: "0 0 120px" }}>
                    <input type="text" value={bid.userName} disabled style={{ width: "100%", borderRadius: "4px", padding: "2px" }} />
                  </div>

                  {/* Voyage */}
                  <div style={{ flex: "0 0 120px" }}>
                    <input type="text" value={bid.voyageName} disabled style={{ width: "100%", borderRadius: "4px", padding: "2px" }} />
                  </div>

                  {/* Save Button */}
                  <div style={{ flex: "0 0 60px" }}>
                    <button
                      onClick={() => handlePatchBid(bid.id)}
                      style={{ width: "100%", backgroundColor: "#0d47a1", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", padding: "2px 0" }}
                    >
                      {saving === bid.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No bids available</p>
          )}
        </div>

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