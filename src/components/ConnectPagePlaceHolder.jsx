import "../assets/css/date-range-custom.css";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import { DefaultSpinner } from "./DefaultSpinner";

export function ConnectPagePlaceHolder() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          <div className="flex connectPage_Bottom_placeholder">
            <div className="flex connectPage_BottomLeft_placeholder">
              <div style={{
                ...SearchBarContainer, backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: "1.5rem", height: "calc(9vh - 0.5rem)", width: "calc(100% - 1.5rem)",
                marginLeft: "1rem", marginTop: "0.5rem"
              }}>
              </div>
              <div style={{
                ...MessagePreviewsContainer,
                backgroundColor: "rgba(255,255,255,0.3)",
                overflowY: "hidden",
                height: "calc(100% - 7rem)",
                marginTop: "1rem",
                width: "calc(100% - 1.5rem)",
                marginLeft: "1rem",
                borderRadius: "1.5rem"
              }}>
                <DefaultSpinner />

              </div>
            </div>
            <div className="flex connectPage_BottomRight_placeHolder">
              <div style={{
                ...ConversationComponentContainer,
                backgroundColor: "rgba(255,255,255,0.3)",
                overflow: "hidden",
                borderRadius: "1.5rem",
                height: `calc(100vh - 12rem)`,

              }}>
                <DefaultSpinner />

              </div>
              <div style={{
                width: "100%",
                backgroundColor: "rgba(255,255,255,0.3)",
                marginTop: "1rem",
                height: "6rem",
                borderRadius: "1.5rem"
              }}>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>

  )
}


const MessagePreviewsContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflowY: "scroll",
}

const ConversationComponentContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowY: "scroll",
  height: `calc(100vh - 10rem)`,
  alignSelf: "flex-start",
}

const SearchBarContainer = {
  backgroundColor: "rgb(240, 240, 240)",
  height: "9vh"
}


