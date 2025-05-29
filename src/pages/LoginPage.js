/* eslint-disable no-undef */
import "../assets/css/App.css";
import "../assets/css/LoginPage.css";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google"; // optional helper library
import { useGoogleLoginInternalMutation as googleLoginMutation } from "../slices/UserSlice";

import { TopBarMenu } from "../components/TopBarMenu";
import { TopLeftComponent } from "../components/TopLeftComponent";
import {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useRequestCodeMutation,
  useResetPasswordMutation,
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
  updateUserFavorites,
} from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateAsLoggedIn } from "../slices/UserSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  parrotBlue,
  parrotDarkBlue,
  parrotTextDarkBlue,
} from "../styles/colors";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { useHealthCheckQuery } from "../slices/HealthSlice";

function LoginPage() {
  const navigate = useNavigate();
  const [triggerGoogleLogin, { isLoading: isLoadingGoogle, data, error }] =
    googleLoginMutation();

  const [pageState, setPageState] = useState("Login");
  const [username, setUsername] = useState("sinanzen@gmail.com");
  const [usernameRegister, setUsernameRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [emailForgotPassword, setEmailForgotPassword] = useState("");
  const [password, setPassword] = useState("123456");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRegister2, setPasswordRegister2] = useState("");
  const [passwordUpdate1, setPasswordUpdate1] = useState("");
  const [passwordUpdate2, setPasswordUpdate2] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [sixDigitCode, setSixDigitCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordRegister2, setShowPasswordRegister2] = useState(false);
  const [showPasswordUpdate1, setShowPasswordUpdate1] = useState(false);
  const [showPasswordUpdate2, setShowPasswordUpdate2] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const dispatch = useDispatch();
  const [loginUser, { isLoading, isSuccess, isError: isLoginError }] =
    useLoginUserMutation();
  const [requestCode] = useRequestCodeMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [
    registerUser,
    { isLoading: isLoadingRegisterUser, isSuccess: isSuccessRegisterUser },
  ] = useRegisterUserMutation();

  const [getFavoriteVehicleIdsByUserId] =
    useLazyGetFavoriteVehicleIdsByUserIdQuery();
  const [getFavoriteVoyageIdsByUserId] =
    useLazyGetFavoriteVoyageIdsByUserIdQuery();

  const [
    confirmUser,
    { isLoading: isLoadingConfirmUser, isSuccess: isSuccessConfirmUser },
  ] = useConfirmUserMutation();

  const handleForgotPassword = () => {
    setPageState("ForgotPassword");
  };

  const handleSignup = () => {
    setPageState("Register1");
  };

  const makeVisible = () => {
    setShowPassword(!showPassword);
  };

  const makeVisibleRegister = () => {
    setShowPasswordRegister(!showPasswordRegister);
  };
  const makeVisibleRegister2 = () => {
    setShowPasswordRegister2(!showPasswordRegister2);
  };

  const makeVisibleUpdate = () => {
    setShowPasswordUpdate1(!showPasswordUpdate1);
  };
  const makeVisibleUpdate2 = () => {
    setShowPasswordUpdate2(!showPasswordUpdate2);
  };
  const handleConfirmCode = async () => {
    try {
      const confirmResponse = await confirmUser({
        email: emailRegister,
        code: confirmationCode,
      }).unwrap();
      setConfirmationCode("");
      setEmailRegister("");
      console.log("confirmResponse:...", confirmResponse);
      if (confirmResponse.token) {
        setPageState("Login");
        // await

        dispatch(
          updateAsLoggedIn({
            userId: confirmResponse.userId,
            token: confirmResponse.token,
            refreshToken: confirmResponse.refreshToken,
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
      setIsLoggingIn(true);
      const loginResponse = await loginUser({
        Email: username,
        Password: password,
      }).unwrap();

      if (!loginResponse?.token) {
        setIsLoggingIn(false);
        console.error("Login failed: No token received");
        return;
      }

      // Store token and refresh token immediately
      localStorage.setItem("storedToken", loginResponse.token);
      localStorage.setItem("storedRefreshToken", loginResponse.refreshToken);

      // Now fetch favorites — token will be sent with these calls
      const favoriteVehicles = await getFavoriteVehicleIdsByUserId(
        loginResponse.userId
      ).unwrap();
      const favoriteVoyages = await getFavoriteVoyageIdsByUserId(
        loginResponse.userId
      ).unwrap();

      setIsLoggingIn(false);

      dispatch(
        updateUserFavorites({
          favoriteVehicles: favoriteVehicles.data,
          favoriteVoyages: favoriteVoyages.data,
        })
      );

      dispatch(
        updateAsLoggedIn({
          userId: loginResponse.userId,
          token: loginResponse.token,
          refreshToken: loginResponse.refreshToken,
          userName: loginResponse.userName,
          profileImageUrl: loginResponse.profileImageUrl,
        })
      );

      setUsername("");
      setPassword("");
      navigate("/");
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

      if (registerResponse.token) {
        setPageState("Register2");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendResetCode = async () => {
    requestCode(emailForgotPassword);
    setPageState("ResetPassword");
  };

  const handleResetPassword = async () => {
    try {
      const resetPasswordResponse = await resetPassword({
        email: emailForgotPassword,
        password: passwordUpdate1,
        confirmationCode: sixDigitCode,
      }).unwrap();

      setPasswordUpdate1("");
      setPasswordUpdate2("");
      setSixDigitCode("");
      if (resetPasswordResponse.token) {
        // await
        dispatch(
          updateAsLoggedIn({
            userId: resetPasswordResponse.userId,
            token: resetPasswordResponse.token,
            refreshToken: resetPasswordResponse.refreshToken,
            userName: resetPasswordResponse.userName,
            profileImageUrl: resetPasswordResponse.profileImageUrl,
          })
        );
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const LoginSpinner = () => {
    return (
      <div
        style={{
          backgroundColor: "rgba(0, 119, 234,0.1)",
          borderRadius: "1.5rem",
          position: "relative",
          margin: "auto",
          height: "1.7rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="spinner"
          style={{
            height: "1rem",
            width: "1rem",
            border: "3px solid white",
            borderTop: "3px solid #1e90ff",
          }}
        ></div>
      </div>
    );
  };

  const { data: healthCheckData, isError: isHealthCheckError } =
    useHealthCheckQuery();

  if (isHealthCheckError) {
    console.log(".....Health check failed.....");
    return <SomethingWentWrong />;
  }

  if (isLoginError) return <SomethingWentWrong />;

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
          <div style={mainWrapper}>
            {pageState === "Login" ? (
              <>
                <div style={mainContainer}>
                  <div style={wrapper}>
                    <div style={welcomeStyle}> Welcome To Parrots!</div>
                    <div className="username-wrapper">
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="username-input"
                        style={{ color: parrotTextDarkBlue }}
                      />
                    </div>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="password-input"
                        style={{ color: parrotTextDarkBlue }}
                      />
                      <span
                        style={{
                          padding: "1rem",
                          position: "absolute",
                          marginLeft: "-4rem",
                          marginTop: "-.3rem",
                        }}
                        onClick={() => makeVisible()}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible
                            size="2rem"
                            color={parrotTextDarkBlue}
                          />
                        ) : (
                          <AiOutlineEye
                            size="2rem"
                            color={parrotTextDarkBlue}
                          />
                        )}
                      </span>
                    </div>
                    <div className="forgot-password">
                      <span
                        className="forgotPasswordSpan"
                        style={{ color: parrotTextDarkBlue, opacity: "0.5" }}
                        onClick={() => handleForgotPassword()}
                      >
                        Forgot password?
                      </span>
                    </div>
                    <div
                      className="login-button"
                      style={{ width: "27rem" }}
                      onClick={() => handleLogin()}
                    >
                      {" "}
                      {isLoggingIn ? <LoginSpinner /> : "Login"}
                    </div>

                    <div className="signup">
                      <span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: parrotTextDarkBlue,
                            opacity: "0.5",
                          }}
                        >
                          Don't have an account?
                        </span>
                        <span
                          onClick={() => handleSignup()}
                          style={{
                            color: parrotTextDarkBlue,
                            opacity: "0.8",
                            fontWeight: "bold",
                            paddingLeft: "0.5rem",
                            cursor: "pointer",
                          }}
                        >
                          Sign up
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: "2rem",
                      }}
                    >
                      <div
                        style={{
                          margin: "auto",
                          marginTop: "2rem",
                          // width: "100%",
                        }}
                      >
                        <GoogleLoginButton />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : pageState === "Register1" ? (
              <div style={mainContainer}>
                <div style={wrapper}>
                  <div style={welcomeStyle}> Welcome To Parrots! </div>
                  <div className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Username (max 25 characters)"
                      value={usernameRegister}
                      onChange={(e) => setUsernameRegister(e.target.value)}
                      className="username-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                  </div>
                  <div className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Email"
                      value={emailRegister}
                      onChange={(e) => setEmailRegister(e.target.value)}
                      className="username-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                  </div>

                  <div className="password-wrapper">
                    <input
                      type={showPasswordRegister ? "text" : "password"}
                      placeholder="Password"
                      value={passwordRegister}
                      onChange={(e) => setPasswordRegister(e.target.value)}
                      className="password-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                    <span
                      style={{
                        padding: "1rem",
                        position: "absolute",
                        marginLeft: "-4rem",
                        marginTop: "-.3rem",
                      }}
                      onClick={() => makeVisibleRegister()}
                    >
                      {showPasswordRegister ? (
                        <AiOutlineEyeInvisible
                          size="2rem"
                          color={parrotTextDarkBlue}
                        />
                      ) : (
                        <AiOutlineEye size="2rem" color={parrotTextDarkBlue} />
                      )}
                    </span>
                  </div>

                  <div className="password-wrapper">
                    <input
                      type={showPasswordRegister2 ? "text" : "password"}
                      placeholder="Re-enter Password"
                      value={passwordRegister2}
                      onChange={(e) => setPasswordRegister2(e.target.value)}
                      className="password-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                    <span
                      style={{
                        padding: "1rem",
                        position: "absolute",
                        marginLeft: "-4rem",
                        marginTop: "-.3rem",
                      }}
                      onClick={() => makeVisibleRegister2()}
                    >
                      {showPasswordRegister2 ? (
                        <AiOutlineEyeInvisible
                          size="2rem"
                          color={parrotTextDarkBlue}
                        />
                      ) : (
                        <AiOutlineEye size="2rem" color={parrotTextDarkBlue} />
                      )}
                    </span>
                  </div>

                  <div
                    className="login-button"
                    onClick={() => handleRegister()}
                  >
                    {" "}
                    Register
                  </div>

                  <div className="signup">
                    <span className="signupSpan">
                      <span
                        className="signupLinkSpan"
                        onClick={() => setPageState("Login")}
                        style={{ color: parrotTextDarkBlue, opacity: "0.5" }}
                      >
                        Back to Login
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : pageState === "Register2" ? (
              <div style={mainContainer}>
                <div style={wrapper}>
                  <div style={welcomeStyle}> Welcome To Parrots! </div>
                  <div className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Confirmation Code"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="username-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                  </div>
                  <div
                    className="login-button"
                    onClick={() => handleConfirmCode()}
                  >
                    {" "}
                    Confirm
                  </div>
                  <div className="signup">
                    <span className="signupSpan" style={{ marginTop: ".5rem" }}>
                      <span
                        className="signupLinkSpan"
                        onClick={() => setPageState("Login")}
                        style={{ color: parrotTextDarkBlue, opacity: "0.5" }}
                      >
                        Back to Login
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : pageState === "ForgotPassword" ? (
              <div style={mainContainer}>
                <div style={wrapper}>
                  <div style={welcomeStyle}> Welcome To Parrots! </div>
                  <div className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Enter email"
                      value={emailForgotPassword}
                      onChange={(e) => setEmailForgotPassword(e.target.value)}
                      className="username-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                  </div>
                  <div
                    className="login-button"
                    style={{ marginTop: "1rem" }}
                    onClick={() => handleSendResetCode()}
                  >
                    Send Code
                  </div>
                  <div className="signup">
                    <span className="signupSpan" style={{ marginTop: ".5rem" }}>
                      <span
                        className="signupLinkSpan"
                        onClick={() => setPageState("Login")}
                        style={{ color: parrotTextDarkBlue, opacity: "0.5" }}
                      >
                        Back to Login
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : pageState === "ResetPassword" ? (
              <div style={mainContainer}>
                <div style={wrapper}>
                  <div style={welcomeStyle}> Welcome To Parrots! </div>
                  <div className="password-wrapper">
                    <input
                      type={showPasswordUpdate1 ? "text" : "password"}
                      placeholder="Password"
                      value={passwordUpdate1}
                      onChange={(e) => setPasswordUpdate1(e.target.value)}
                      className="password-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                    <span
                      style={{
                        padding: "1rem",
                        position: "absolute",
                        marginLeft: "-4rem",
                        marginTop: "-.3rem",
                      }}
                      onClick={() => makeVisibleUpdate()}
                    >
                      {showPasswordUpdate1 ? (
                        <AiOutlineEyeInvisible
                          size="2rem"
                          color={parrotTextDarkBlue}
                        />
                      ) : (
                        <AiOutlineEye size="2rem" color={parrotTextDarkBlue} />
                      )}
                    </span>
                  </div>
                  <div className="password-wrapper">
                    <input
                      type={showPasswordUpdate2 ? "text" : "password"}
                      placeholder="Re-enter Password"
                      value={passwordUpdate2}
                      onChange={(e) => setPasswordUpdate2(e.target.value)}
                      className="password-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                    <span
                      style={{
                        padding: "1rem",
                        position: "absolute",
                        marginLeft: "-4rem",
                        marginTop: "-.3rem",
                      }}
                      onClick={() => makeVisibleUpdate2()}
                    >
                      {showPasswordUpdate2 ? (
                        <AiOutlineEyeInvisible
                          size="2rem"
                          color={parrotTextDarkBlue}
                        />
                      ) : (
                        <AiOutlineEye size="2rem" color={parrotTextDarkBlue} />
                      )}
                    </span>
                  </div>

                  <div className="username-wrapper">
                    <input
                      type="text"
                      placeholder="Enter 6 digit code"
                      value={sixDigitCode}
                      onChange={(e) => setSixDigitCode(e.target.value)}
                      className="username-input"
                      style={{ color: parrotTextDarkBlue }}
                    />
                  </div>

                  <div
                    className="login-button"
                    onClick={() => handleResetPassword()}
                  >
                    {" "}
                    Update Password
                  </div>

                  <div className="signup">
                    <span className="signupSpan">
                      <span
                        className="signupLinkSpan"
                        onClick={() => setPageState("Login")}
                        style={{ color: parrotTextDarkBlue, opacity: "0.5" }}
                      >
                        Back to Login
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default LoginPage;

const mainWrapper = {};

const wrapper = {
  backgroundColor: "white",
  width: "100%",
  padding: "1rem",
  paddingTop: "2rem",
  paddingBottom: "3rem",
  borderRadius: "1.5rem",
};

const mainContainer = {
  backgroundColor: "rgba(255, 255, 255, .3)",
  width: "40%",
  margin: "auto",
  borderRadius: "2rem",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  marginTop: "3rem",
};

const welcomeStyle = {
  color: "rgba(10, 119, 234,.7)",
  margin: "0.5rem",
  fontSize: "1.8rem",
  fontWeight: "bold",
  borderRadius: "2rem",
};
