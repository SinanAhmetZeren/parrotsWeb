import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import {
  updateAsLoggedIn,
  useGoogleLoginInternalMutation,
} from "../slices/UserSlice";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const [googleLoginInternal, { isLoading, error, data }] =
    useGoogleLoginInternalMutation();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        if (idToken) {
          try {
            const res = await googleLoginInternal(idToken).unwrap();
            console.log("Login internal response--->", res);

            await dispatch(
              updateAsLoggedIn({
                userId: res.userId,
                token: res.token,
                userName: res.userName,
                profileImageUrl: res.profileImageUrl,
              })
            );

            // You can also navigate here if needed
          } catch (err) {
            console.error("Login failed:", err);
          }
        } else {
          console.error("No ID token received from Google");
        }
      }}
      onError={() => {
        console.error("Google login failed");
      }}
    />
  );
};

export default GoogleLoginButton;
