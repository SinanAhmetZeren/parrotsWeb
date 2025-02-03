/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/LoginPage.css"

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useRequestCodeMutation,
  useResetPasswordMutation,
} from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateAsLoggedIn } from "../slices/UserSlice";
import { IoPersonOutline, IoPeopleOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

function LoginPage() {
  const [pageState, setPageState] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();
  const [requestCode] = useRequestCodeMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [
    registerUser,
    { isLoading: isLoadingRegisterUser, isSuccess: isSuccessRegisterUser },
  ] = useRegisterUserMutation();
  const [
    confirmUser,
    { isLoading: isLoadingConfirmUser, isSuccess: isSuccessConfirmUser },
  ] = useConfirmUserMutation();



  const userId = "43242342432342342342";
  const myApiKey = "AIzaSyAsqIXNMISkZ0eprGc2iTLbiQk0QBtgq0c";

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex mainpage_Container">
          <div className="flex mainpage_TopRow">
            <TopLeftComponent userName={"Peter Parker"} />
            <div className="flex mainpage_TopRight">
              <TopBarMenu />
            </div>
          </div>

          <div style={mainContainer}>
            <div style={welcomeStyle}> Welcome To Parrots !</div>
            <div style={emailStyle}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="email-input"
              />
            </div>
            <div style={passWordStyle}>
              <input
                type="text"
                placeholder="Password"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="password-input"
              />

            </div>
            <div className="forgot-password-signup"> Forgot password?</div>
            <div className="login-button"> Login</div>
            <div className="forgot-password-signup"> Don't have an account?  Sign up</div>
          </div>


        </div>
      </header>
    </div>
  );
}

export default LoginPage;

const mainContainer = {
  backgroundColor: "rgba(255, 255, 255, 1)",
  width: "50%",
  margin: "auto",
  height: "30rem",
  borderRadius: "1rem",
  padding: "2rem"
}

const welcomeStyle = {
  backgroundColor: "#addbe655",
  color: "rgb(10, 119, 234)",
  margin: "0.5rem",
  fontSize: "3rem",
  fontWeight: "bold",
  borderRadius: "2rem"
}

const emailStyle = {
  backgroundColor: "#addbe6",
  color: "blue",
  margin: "0.5rem"

}

const passWordStyle = {
  backgroundColor: "#addbe6",
  color: "blue",
  margin: "0.5rem"
}

const loginStyle = {
  backgroundColor: "#addbe6",
  color: "blue"
}

const signUpStyle = {
  backgroundColor: "#addbe6",
  color: "blue",
  margin: "0.5rem"
}



const buttonStyle = {
  width: "40%",
  backgroundColor: "#007bff",
  padding: "0.6rem",
  marginTop: "2rem",
  borderRadius: "1.5rem",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.2rem",
  border: "none",
  boxShadow:
    "0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -4px 6px rgba(0, 0, 0, 0.3)",
  transition: "box-shadow 0.2s ease",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};