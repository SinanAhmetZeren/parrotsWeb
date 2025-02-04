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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState("Login");
  const [username, setUsername] = useState("sinanzen@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()

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

  const handleForgotPassword = () => {
    console.log("Forgot password...");
  }

  const handleSignup = () => {
    console.log("handleSignup...");
  }

  const makeVisible = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin2 = async () => {
    try {
      const loginResponse = await loginUser({
        Email: username,
        Password: password,
      }).unwrap();
      setUsername("");
      setPassword("");
      if (loginResponse.token) {
        await dispatch(
          updateAsLoggedIn({
            userId: loginResponse.userId,
            token: loginResponse.token,
            userName: loginResponse.userName,
            profileImageUrl: loginResponse.profileImageUrl,
          })
        );
      }

    } catch (err) {
      console.log("hello from catch - handle login");
      console.log(err);
    }
  };

  const handleLogin = async () => {
    try {
      const loginResponse = await loginUser({
        Email: username,
        Password: password,
      }).unwrap();
      if (!loginResponse?.token) {
        console.error("Login failed: No token received");
        return;
      }
      await dispatch(
        updateAsLoggedIn({
          userId: loginResponse.userId,
          token: loginResponse.token,
          userName: loginResponse.userName,
          profileImageUrl: loginResponse.profileImageUrl,
        })
      );
      setUsername("");
      setPassword("");
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
    }
  };



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
            <div style={welcomeStyle}> Welcome To Parrots!</div>
            <div
              className="username-wrapper">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-input"
              />
            </div>
            <div
              className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              <span style={{
                padding: "1rem",
                position: "absolute",
                marginLeft: "-5rem",
                marginTop: "-.2rem"
              }}
                onClick={() => makeVisible()}
              >
                {
                  showPassword ?
                    <AiOutlineEyeInvisible size="2rem" color="grey" /> :
                    <AiOutlineEye size="2rem" color="grey" />
                }
              </span>

            </div>
            <div className="forgot-password">
              <span className="forgotPasswordSpan"
                onClick={() => handleForgotPassword()}
              >
                Forgot password?
              </span>
            </div>
            <div className="login-button"
              onClick={() => handleLogin()}
            > Login</div>

            <div className="signup">
              <span className="signupSpan">
                Don't have an account?
                <span className="signupLinkSpan"
                  onClick={() => handleSignup()}
                >
                  Sign up
                </span>
              </span>
            </div>

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
  color: "rgba(10, 119, 234,.7)",
  margin: "0.5rem",
  fontSize: "3rem",
  fontWeight: "bold",
  borderRadius: "2rem"
}

