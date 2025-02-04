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
  const [pageState, setPageState] = useState("Register2");
  const [username, setUsername] = useState("sinanzen@gmail.com");
  const [usernameRegister, setUsernameRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("yyy");
  const [password, setPassword] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRegister2, setPasswordRegister2] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordRegister2, setShowPasswordRegister2] = useState(false);


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
  const makeVisibleRegister = () => {
    setShowPasswordRegister(!showPasswordRegister)
  }
  const makeVisibleRegister2 = () => {
    setShowPasswordRegister2(!showPasswordRegister2)
  }

  const handleConfirmCode = async () => {
    console.log("email R:", emailRegister);
    console.log("confirmation code: ", confirmationCode);
    try {
      const confirmResponse = await confirmUser({
        email: emailRegister,
        code: confirmationCode,
      }).unwrap();

      setConfirmationCode("");
      setEmailRegister("");

      if (confirmResponse.token) {
        setPageState("Login");

        await dispatch(
          updateAsLoggedIn({
            userId: confirmResponse.userId,
            token: confirmResponse.token,
            userName: confirmResponse.userName,
            profileImageUrl: confirmResponse.profileImageUrl,
          })
        );
      }
    } catch (err) {
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
      console.log("let s go to profile ?");
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleRegister = async () => {
    try {
      const registerResponse = await registerUser({
        Email: emailRegister,
        UserName: usernameRegister,
        Password: passwordRegister,
      }).unwrap();

      setUsernameRegister("");
      setPasswordRegister("");
      setPasswordRegister2("");

      // if registration response is 200
      // go to Registration-2

      // if ConfirmCode returns token etc
      // then updateasLoggedIn

      if (registerResponse.token) {
        setPageState("Register2");
        /*
        await dispatch(
          updateAsLoggedIn({
            userId: registerResponse.userId,
            token: registerResponse.token,
            userName: registerResponse.userName,
            profileImageUrl: registerResponse.profileImageUrl,
          })
        );
        */
      }
    } catch (err) {
      console.log(err);
    }
  };

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

          {
            pageState === "Login" ?
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
              : pageState === "Register1" ?
                <div style={mainContainer}>
                  <div style={welcomeStyle}> Welcome To Parrots! {pageState}</div>
                  <div
                    className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Username (max 25 characters)"
                      value={usernameRegister}
                      onChange={(e) => setUsernameRegister(e.target.value)}
                      className="username-input"
                    />
                  </div>
                  <div
                    className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Email"
                      value={emailRegister}
                      onChange={(e) => setEmailRegister(e.target.value)}
                      className="username-input"
                    />
                  </div>

                  <div
                    className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={passwordRegister}
                      onChange={(e) => setPasswordRegister(e.target.value)}
                      className="password-input"
                    />
                    <span style={{
                      padding: "1rem",
                      position: "absolute",
                      marginLeft: "-5rem",
                      marginTop: "-.2rem"
                    }}
                      onClick={() => makeVisibleRegister()}
                    >
                      {
                        showPasswordRegister ?
                          <AiOutlineEyeInvisible size="2rem" color="grey" /> :
                          <AiOutlineEye size="2rem" color="grey" />
                      }
                    </span>
                  </div>


                  <div
                    className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter Password"
                      value={passwordRegister2}
                      onChange={(e) => setPasswordRegister2(e.target.value)}
                      className="password-input"
                    />
                    <span style={{
                      padding: "1rem",
                      position: "absolute",
                      marginLeft: "-5rem",
                      marginTop: "-.2rem"
                    }}
                      onClick={() => makeVisibleRegister2()}
                    >
                      {
                        showPasswordRegister2 ?
                          <AiOutlineEyeInvisible size="2rem" color="grey" /> :
                          <AiOutlineEye size="2rem" color="grey" />
                      }
                    </span>
                  </div>

                  {/* <div className="forgot-password">
                    <span className="forgotPasswordSpan"
                      onClick={() => handleForgotPassword()}
                    >
                      Forgot password?
                    </span>
                  </div> */}
                  <div className="login-button"
                    onClick={() => handleRegister()}
                  > Register</div>
                  {/* <div className="signup">
                    <span className="signupSpan">
                      Don't have an account?
                      <span className="signupLinkSpan"
                        onClick={() => handleSignup()}
                      >
                        Sign up
                      </span>
                    </span>
                  </div> */}
                </div>
                : pageState === "Register2" ?
                  <div style={mainContainer}>
                    <div style={welcomeStyle}> Welcome To Parrots! {pageState}</div>
                    <div
                      className="username-wrapper">
                      <input
                        type="text"
                        placeholder="Confirmation Code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        className="username-input"
                      />
                    </div>

                    <div className="login-button"
                      onClick={() => handleConfirmCode()}
                    > Confirm</div>
                  </div> : <></>
          }


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

