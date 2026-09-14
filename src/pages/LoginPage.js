/* eslint-disable no-undef */
import { useState } from "react";
import {
  useRegisterUserMutation,
  useConfirmUserMutation,
  useLoginUserMutation,
  useAcceptTermsMutation,
  useRequestCodeMutation,
  useResetPasswordMutation,
  updateUserFavorites,
  setBookmarkedUserIds,
} from "../slices/UserSlice";
import { useDispatch } from "react-redux";
import { updateAsLoggedIn, setRequiresTermsAcceptance } from "../slices/UserSlice";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { SomethingWentWrong } from "../components/SomethingWentWrong";
import { TERMS_VERSION } from "../constants/TermsVersion";
import TermsOfUseComponent from "../components/TermsOfUseComponent";
import { useHealthCheckQuery } from "../slices/HealthSlice";
import { toast } from "react-toastify";
import sailboatBg from "../assets/images/sailboat2.jpg";

// ── tokens ────────────────────────────────────────────────────────────────────
const C = {
  blue:    "#0A77EA",
  blueDk:  "#0A5FBF",
  blueLt:  "#3B9BF5",
  navy:    "#0A2540",
  deep:    "#081E36",
  frame:   "#123E74",
  mid:     "#5C6B7A",
  ph:      "#7A8896",
  line:    "#D9E2EC",
  tint:    "#F4F7FB",
  green:   "#2AC898",
  red:     "#C22F3D",
};

// ── eye toggle SVG ────────────────────────────────────────────────────────────
function EyeBtn({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} style={s.eye} aria-label={show ? "Hide password" : "Show password"}>
      {show ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
          <path d="M4 4l16 16"/>
          <path d="M9.6 6.1A9.6 9.6 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3 3.8"/>
          <path d="M6.7 8.3A17 17 0 0 0 2 12s3.6 6.5 10 6.5c1 0 1.9-.1 2.7-.4"/>
          <path d="M9.6 9.8a2.8 2.8 0 0 0 3.9 3.9"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/>
          <circle cx="12" cy="12" r="2.8"/>
        </svg>
      )}
    </button>
  );
}

// ── validation hint pill ──────────────────────────────────────────────────────
function HintPill({ rules }) {
  return (
    <div style={s.hintPill}>
      {rules.map(({ label, ok }) => (
        <div key={label} style={{ color: ok ? "#a8e6cf" : "#ffb3b3", fontSize: 13.5, fontWeight: 600 }}>
          {ok ? "✓" : "✗"} {label}
        </div>
      ))}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [confirmUser] = useConfirmUserMutation();
  const [acceptTerms] = useAcceptTermsMutation();
  const [requestCode] = useRequestCodeMutation();
  const [resetPassword] = useResetPasswordMutation();

  // page states: Login | ForgotPassword | Register1 | Register2 | ResetPassword
  const [page, setPage] = useState("Login");

  // shared inputs
  const [username,          setUsername]          = useState("");
  const [password,          setPassword]          = useState("");
  const [showPw,            setShowPw]            = useState(false);

  const [usernameReg,       setUsernameReg]       = useState("");
  const [emailReg,          setEmailReg]          = useState("");
  const [passwordReg,       setPasswordReg]       = useState("");
  const [passwordReg2,      setPasswordReg2]      = useState("");
  const [showPwReg,         setShowPwReg]         = useState(false);
  const [showPwReg2,        setShowPwReg2]        = useState(false);
  const [termsAccepted,     setTermsAccepted]     = useState(false);
  const [termsModalOpen,    setTermsModalOpen]    = useState(false);
  const [focusedField,      setFocusedField]      = useState(null);

  const [emailForgot,       setEmailForgot]       = useState("");

  const [confirmCode,       setConfirmCode]       = useState("");
  const [sixCode,           setSixCode]           = useState("");
  const [pwUpdate1,         setPwUpdate1]         = useState("");
  const [pwUpdate2,         setPwUpdate2]         = useState("");
  const [showPwU1,          setShowPwU1]          = useState(false);
  const [showPwU2,          setShowPwU2]          = useState(false);

  const [busy,              setBusy]              = useState(false);
  const [requiresReTerms,   setRequiresReTerms]   = useState(false);
  const [pendingLogin,      setPendingLogin]       = useState(null);

  const { isError: isHealthError } = useHealthCheckQuery();
  if (isHealthError) return <SomethingWentWrong />;

  if (sessionStorage.getItem("sessionExpired")) {
    sessionStorage.removeItem("sessionExpired");
    toast.warning("Your session has expired. Please log in again.");
  }

  const resetForms = () => {
    setUsernameReg(""); setEmailReg(""); setEmailForgot("");
    setPasswordReg(""); setPasswordReg2("");
    setPwUpdate1(""); setPwUpdate2("");
    setConfirmCode(""); setSixCode("");
    setTermsAccepted(false); setFocusedField(null);
  };

  const go = (p) => { resetForms(); setPage(p); };

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!username || !password) { toast.error("Please enter both email and password."); return; }
    try {
      setBusy(true);
      const r = await loginUser({ Email: username, Password: password }).unwrap();
      if (!r?.token) { toast.error("Login failed: Invalid credentials."); return; }
      localStorage.setItem("storedToken", r.token);
      localStorage.setItem("storedRefreshToken", r.refreshToken);
      dispatch(updateUserFavorites({ favoriteVehicles: r.favoriteVehicleIds, favoriteVoyages: r.favoriteVoyageIds }));
      dispatch(setBookmarkedUserIds(r.bookmarkedUserIds || []));
      dispatch(updateAsLoggedIn({ userId: r.userId, token: r.token, refreshToken: r.refreshToken, userName: r.userName, profileImageUrl: r.profileImageUrl, isAdmin: r.isAdmin, hasAcknowledgedPublicProfile: r.hasAcknowledgedPublicProfile ?? false, hasAcknowledgedGroupHistory: r.hasAcknowledgedGroupHistory ?? false }));
      if (r.requiresTermsAcceptance) dispatch(setRequiresTermsAcceptance(true));
      setUsername(""); setPassword("");
      navigate("/");
    } catch (err) {
      toast.error(err.status === 401 ? "Incorrect email or password." : "Login failed. Please try again.");
    } finally { setBusy(false); }
  };

  const handleRegister = async () => {
    if (!usernameReg || !emailReg || !passwordReg || !passwordReg2) { toast.error("All fields are required."); return; }
    if (passwordReg !== passwordReg2) { toast.error("Passwords do not match."); return; }
    const pwOk = passwordReg.length >= 8 && /[A-Z]/.test(passwordReg) && /[a-z]/.test(passwordReg) && /[0-9]/.test(passwordReg);
    if (!pwOk) { toast.error("Password must be 8+ chars with uppercase, lowercase, and a number."); return; }
    try {
      setBusy(true);
      const r = await registerUser({ Email: emailReg, UserName: usernameReg, Password: passwordReg, TermsVersion: TERMS_VERSION }).unwrap();
      if (r?.token) { setUsernameReg(""); setPasswordReg(""); setPasswordReg2(""); setPage("Register2"); }
      else toast.error("Registration failed: No token received.");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed. Please check your details.");
    } finally { setBusy(false); }
  };

  const handleConfirm = async () => {
    if (!confirmCode) return;
    try {
      setBusy(true);
      const r = await confirmUser({ email: emailReg, code: confirmCode }).unwrap();
      setConfirmCode(""); setEmailReg("");
      if (r.token) {
        dispatch(updateAsLoggedIn({ userId: r.userId, token: r.token, refreshToken: r.refreshToken, userName: r.userName, profileImageUrl: r.profileImageUrl, isAdmin: r.isAdmin, hasAcknowledgedPublicProfile: r.hasAcknowledgedPublicProfile ?? false, hasAcknowledgedGroupHistory: r.hasAcknowledgedGroupHistory ?? false }));
        dispatch(updateUserFavorites({ favoriteVehicles: r.favoriteVehicleIds, favoriteVoyages: r.favoriteVoyageIds }));
        dispatch(setBookmarkedUserIds(r.bookmarkedUserIds || []));
        if (r.requiresTermsAcceptance) dispatch(setRequiresTermsAcceptance(true));
      }
      navigate("/");
    } catch { toast.error("Invalid confirmation code. Please try again."); }
    finally { setBusy(false); }
  };

  const handleSendCode = async () => {
    if (!emailForgot) return;
    try {
      setBusy(true);
      await requestCode(emailForgot).unwrap();
      resetForms();
      setPage("ResetPassword");
    } catch { toast.error("Failed to send reset code. Please check your email."); }
    finally { setBusy(false); }
  };

  const handleResetPassword = async () => {
    if (!sixCode || !pwUpdate1 || !pwUpdate2) return;
    try {
      setBusy(true);
      const r = await resetPassword({ email: emailForgot, password: pwUpdate1, confirmationCode: sixCode }).unwrap();
      setPwUpdate1(""); setPwUpdate2(""); setSixCode("");
      if (r.token) {
        dispatch(updateAsLoggedIn({ userId: r.userId, token: r.token, refreshToken: r.refreshToken, userName: r.userName, profileImageUrl: r.profileImageUrl, isAdmin: r.isAdmin, hasAcknowledgedPublicProfile: r.hasAcknowledgedPublicProfile ?? false, hasAcknowledgedGroupHistory: r.hasAcknowledgedGroupHistory ?? false }));
        dispatch(updateUserFavorites({ favoriteVehicles: r.favoriteVehicleIds, favoriteVoyages: r.favoriteVoyageIds }));
        dispatch(setBookmarkedUserIds(r.bookmarkedUserIds || []));
        if (r.requiresTermsAcceptance) dispatch(setRequiresTermsAcceptance(true));
      }
      navigate("/");
    } catch { toast.error("Error resetting password. Please check your code."); }
    finally { setBusy(false); }
  };

  const handleAcceptUpdatedTerms = async () => {
    try {
      await acceptTerms().unwrap();
      const d = pendingLogin;
      dispatch(updateAsLoggedIn({ userId: d.userId, token: d.token, refreshToken: d.refreshToken, userName: d.userName, profileImageUrl: d.profileImageUrl, isAdmin: d.isAdmin, hasAcknowledgedPublicProfile: d.hasAcknowledgedPublicProfile ?? false }));
      dispatch(updateUserFavorites({ favoriteVehicles: d.favoriteVehicleIds, favoriteVoyages: d.favoriteVoyageIds }));
      dispatch(setBookmarkedUserIds(d.bookmarkedUserIds || []));
      setRequiresReTerms(false); setPendingLogin(null);
      setUsername(""); setPassword("");
      navigate("/");
    } catch { toast.error("Failed to accept terms. Please try again."); }
  };

  if (requiresReTerms) {
    return (
      <div>
        <TermsOfUseComponent open={true} onClose={() => { setRequiresReTerms(false); setPendingLogin(null); }} onAccept={handleAcceptUpdatedTerms} />
      </div>
    );
  }

  // ── register validation ──────────────────────────────────────────────────────
  const usernameRules = [
    { label: "At least 3 characters", ok: usernameReg.length >= 3 },
    { label: "Max 25 characters", ok: usernameReg.length <= 25 },
    { label: "Letters, numbers, underscores only", ok: usernameReg.length === 0 || /^[a-zA-Z0-9_]+$/.test(usernameReg) },
  ];
  const emailRules = [{ label: "Valid email format", ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailReg) }];
  const passwordRules = [
    { label: "At least 8 characters", ok: passwordReg.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(passwordReg) },
    { label: "One lowercase letter", ok: /[a-z]/.test(passwordReg) },
    { label: "One number", ok: /[0-9]/.test(passwordReg) },
    { label: "Passwords match", ok: passwordReg.length > 0 && passwordReg === passwordReg2 },
  ];

  const registerReady = usernameReg.length >= 3 && /^[a-zA-Z0-9_]+$/.test(usernameReg)
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailReg)
    && passwordReg.length >= 8 && /[A-Z]/.test(passwordReg) && /[a-z]/.test(passwordReg) && /[0-9]/.test(passwordReg)
    && passwordReg === passwordReg2 && termsAccepted;

  return (
    <div style={s.root}>
      {/* Hero / background */}
      <div style={s.hero}>
        <img src={sailboatBg} alt="" style={s.heroBg} />
        <div style={s.heroOverlay} />

        {/* Centered frame */}
        <div style={s.frame}>
          <div style={s.card}>

            {/* ── Login ── */}
            {page === "Login" && (
              <>
                <h1 style={s.h1}>Welcome to Parrots</h1>
                <div style={s.fields}>
                  <div style={s.fld}>
                    <input style={s.input} type="email" placeholder="Email" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="email" />
                  </div>
                  <div style={s.fld}>
                    <input style={s.input} type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="current-password" />
                    <EyeBtn show={showPw} onToggle={() => setShowPw(v => !v)} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={s.lnk} onClick={() => go("ForgotPassword")}>Forgot password?</button>
                  </div>
                  <button style={{ ...s.btn, opacity: username && password ? 1 : 0.55 }} onClick={handleLogin} disabled={busy || !username || !password}>
                    {busy ? <Spinner /> : "Login"}
                  </button>
                  <div style={s.rowMid}>
                    Don't have an account?
                    <button style={s.lnk} onClick={() => go("Register1")}>Sign up</button>
                  </div>
                </div>
                <Or />
                <GoogleLoginButton />
              </>
            )}

            {/* ── Forgot password ── */}
            {page === "ForgotPassword" && (
              <>
                <h1 style={s.h1}>Reset your password</h1>
                <div style={s.fields}>
                  <div style={s.fld}>
                    <input style={s.input} type="email" placeholder="Enter email" value={emailForgot} onChange={e => setEmailForgot(e.target.value)} autoComplete="email" />
                  </div>
                  <button style={{ ...s.btn, opacity: emailForgot ? 1 : 0.55 }} onClick={handleSendCode} disabled={busy || !emailForgot}>
                    {busy ? <Spinner /> : "Send Code"}
                  </button>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={s.lnk} onClick={() => go("Login")}>Back to Login</button>
                  </div>
                </div>
              </>
            )}

            {/* ── Register ── */}
            {page === "Register1" && (
              <>
                <h1 style={s.h1}>Let's get started</h1>
                <div style={{ ...s.fields, position: "relative" }}>
                  {focusedField === "username" && <HintPill rules={usernameRules} />}
                  {focusedField === "email" && <HintPill rules={emailRules} />}
                  {(focusedField === "password" || focusedField === "password2") && <HintPill rules={passwordRules} />}
                  <div style={s.fld}>
                    <input style={s.input} type="text" placeholder="Username (3-25 characters)" value={usernameReg} maxLength={25} onChange={e => setUsernameReg(e.target.value)} onFocus={() => setFocusedField("username")} onBlur={() => setFocusedField(null)} autoComplete="username" />
                  </div>
                  <div style={s.fld}>
                    <input style={s.input} type="email" placeholder="Email" value={emailReg} onChange={e => setEmailReg(e.target.value)} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} autoComplete="email" />
                  </div>
                  <div style={s.fld}>
                    <input style={s.input} type={showPwReg ? "text" : "password"} placeholder="Password" value={passwordReg} onChange={e => setPasswordReg(e.target.value)} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} autoComplete="new-password" />
                    <EyeBtn show={showPwReg} onToggle={() => setShowPwReg(v => !v)} />
                  </div>
                  <div style={s.fld}>
                    <input style={s.input} type={showPwReg2 ? "text" : "password"} placeholder="Re-enter Password" value={passwordReg2} onChange={e => setPasswordReg2(e.target.value)} onFocus={() => setFocusedField("password2")} onBlur={() => setFocusedField(null)} autoComplete="new-password" />
                    <EyeBtn show={showPwReg2} onToggle={() => setShowPwReg2(v => !v)} />
                  </div>
                  <label style={s.terms}>
                    <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} style={{ width: 19, height: 19, flexShrink: 0, accentColor: C.blue, margin: 0 }} />
                    <span>I have read and agree to the{" "}
                      <span onClick={() => setTermsModalOpen(true)} style={{ color: C.blue, fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>Terms of Use</span>
                    </span>
                  </label>
                  <TermsOfUseComponent open={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
                  <button style={{ ...s.btn, opacity: registerReady ? 1 : 0.55 }} onClick={handleRegister} disabled={busy || !registerReady}>
                    {busy ? <Spinner /> : "Register"}
                  </button>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={s.lnk} onClick={() => go("Login")}>Back to Login</button>
                  </div>
                </div>
              </>
            )}

            {/* ── Almost there (confirm code) ── */}
            {page === "Register2" && (
              <>
                <h1 style={s.h1}>Almost there</h1>
                <div style={s.fields}>
                  <div style={s.fld}>
                    <input style={{ ...s.input, letterSpacing: "0.3em" }} type="text" placeholder="Confirmation Code" value={confirmCode} onChange={e => setConfirmCode(e.target.value)} inputMode="numeric" maxLength={6} autoComplete="one-time-code" />
                  </div>
                  <button style={{ ...s.btn, opacity: confirmCode ? 1 : 0.55 }} onClick={handleConfirm} disabled={busy || !confirmCode}>
                    {busy ? <Spinner /> : "Confirm"}
                  </button>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={s.lnk} onClick={() => go("Login")}>Back to Login</button>
                  </div>
                </div>
              </>
            )}

            {/* ── Check email (reset password) ── */}
            {page === "ResetPassword" && (
              <>
                <h1 style={s.h1}>Check your email</h1>
                <div style={s.fields}>
                  <div style={s.fld}>
                    <input style={s.input} type={showPwU1 ? "text" : "password"} placeholder="New Password" value={pwUpdate1} onChange={e => setPwUpdate1(e.target.value)} autoComplete="new-password" />
                    <EyeBtn show={showPwU1} onToggle={() => setShowPwU1(v => !v)} />
                  </div>
                  <div style={s.fld}>
                    <input style={s.input} type={showPwU2 ? "text" : "password"} placeholder="Re-enter Password" value={pwUpdate2} onChange={e => setPwUpdate2(e.target.value)} autoComplete="new-password" />
                    <EyeBtn show={showPwU2} onToggle={() => setShowPwU2(v => !v)} />
                  </div>
                  <div style={s.fld}>
                    <input style={{ ...s.input, letterSpacing: "0.3em" }} type="text" placeholder="Enter 6 digit code" value={sixCode} onChange={e => setSixCode(e.target.value)} inputMode="numeric" maxLength={6} autoComplete="one-time-code" />
                  </div>
                  <button style={{ ...s.btn, opacity: sixCode && pwUpdate1 && pwUpdate2 ? 1 : 0.55 }} onClick={handleResetPassword} disabled={busy || !sixCode || !pwUpdate1 || !pwUpdate2}>
                    {busy ? <Spinner /> : "Update Password"}
                  </button>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={s.lnk} onClick={() => go("Login")}>Back to Login</button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}

export default LoginPage;

// ── helpers ───────────────────────────────────────────────────────────────────
function Spinner() {
  return <div style={{ width: 22, height: 22, border: "3px solid rgba(255,255,255,.35)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto" }} />;
}
function Or() {
  return <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0 12px", fontSize: 11, fontWeight: 800, letterSpacing: ".11em", textTransform: "uppercase", color: C.mid }}>
    <span style={{ flex: 1, height: 1, background: C.line }} />or<span style={{ flex: 1, height: 1, background: C.line }} />
  </div>;
}

// ── styles ────────────────────────────────────────────────────────────────────
const s = {
  root: {
    fontFamily: "'Nunito', system-ui, sans-serif",
    minHeight: "100vh",
    background: C.deep,
    display: "flex",
    flexDirection: "column",
  },
  hero: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "26px 18px 90px",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute", inset: 0,
    width: "100%", height: "100%",
    objectFit: "fill", objectPosition: "center",
  },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(180deg,rgba(8,30,54,.44),rgba(8,30,54,.72))",
  },
  frame: {
    position: "relative", zIndex: 2,
    background: C.frame,
    borderRadius: 24, padding: 11,
    width: "100%", maxWidth: 498,
    boxShadow: "0 22px 60px rgba(0,10,24,.5)",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: "34px 36px 32px",
  },
  h1: {
    fontSize: 33, fontWeight: 900, letterSpacing: "-.025em",
    color: C.blue, textAlign: "center", lineHeight: 1.1, margin: 0,
  },
  sub: {
    fontSize: 19, fontWeight: 800, color: C.blueLt,
    textAlign: "center", marginTop: 8,
  },
  fields: {
    display: "flex", flexDirection: "column", gap: 11, marginTop: 22,
  },
  fld: {
    position: "relative", display: "flex",
  },
  input: {
    fontFamily: "inherit",
    width: "100%", fontSize: 15, fontWeight: 700, color: C.navy,
    background: "#fff", border: `1.5px solid ${C.line}`,
    borderRadius: 99, padding: "10px 44px 10px 16px",
    outline: "none",
  },
  eye: {
    position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
    width: 40, height: 40, border: "none", background: "none",
    borderRadius: "50%", color: C.mid,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  },
  lnk: {
    fontFamily: "inherit", background: "none", border: "none", padding: 0,
    fontSize: 14.5, fontWeight: 800, color: C.blueDk, cursor: "pointer",
  },
  rowMid: {
    display: "flex", justifyContent: "center", alignItems: "center", gap: 7,
    fontSize: 14.5, fontWeight: 700, color: C.mid,
  },
  btn: {
    fontFamily: "inherit", border: "none", width: "100%",
    fontSize: 14, fontWeight: 700, color: "#fff",
    background: C.blue, borderRadius: 20,
    height: 40, padding: "0 12px", cursor: "pointer", marginTop: 5,
    boxShadow: "0 6px 16px rgba(10,119,234,.25)",
    transition: "background .15s",
  },
  terms: {
    display: "flex", alignItems: "flex-start", gap: 10,
    fontSize: 14, fontWeight: 700, color: C.navy,
    lineHeight: 1.45, cursor: "pointer",
  },
  hintPill: {
    position: "absolute",
    top: "50%", left: "calc(100% + 16px)",
    transform: "translateY(-50%)",
    background: "#1a56b0",
    borderRadius: 20, padding: "0.75rem 1.4rem",
    zIndex: 10, whiteSpace: "nowrap",
    display: "flex", flexDirection: "column", gap: "0.3rem",
    boxShadow: "0 8px 24px rgba(0,0,0,.25)",
  },
  switcher: {
    position: "fixed", left: "50%", bottom: 14,
    transform: "translateX(-50%)", zIndex: 99,
    display: "flex", gap: 4,
    background: "rgba(8,30,54,.9)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,.16)",
    borderRadius: 99, padding: 5,
  },
  switchBtn: {
    fontFamily: "inherit", border: "none", background: "none",
    color: "rgba(255,255,255,.66)", fontSize: 12.5, fontWeight: 800,
    padding: "8px 14px", borderRadius: 99, cursor: "pointer", whiteSpace: "nowrap",
  },
  switchBtnOn: {
    background: C.blue, color: "#fff",
  },
};
