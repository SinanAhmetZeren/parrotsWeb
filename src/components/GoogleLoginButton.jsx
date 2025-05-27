import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGoogleLoginInternalMutation } from "../slices/UserSlice";
import { updateAsLoggedIn, updateUserFavorites } from "../slices/UserSlice";
import {
  useLazyGetFavoriteVoyageIdsByUserIdQuery,
  useLazyGetFavoriteVehicleIdsByUserIdQuery,
} from "../slices/UserSlice";

export default function GoogleLoginButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleLoginInternal, { isLoading, error, data }] =
    useGoogleLoginInternalMutation();

  const [getFavoriteVehicleIdsByUserId] =
    useLazyGetFavoriteVehicleIdsByUserIdQuery();
  const [getFavoriteVoyageIdsByUserId] =
    useLazyGetFavoriteVoyageIdsByUserIdQuery();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        if (!idToken) {
          console.error("No ID token received from Google");
          return;
        }

        try {
          const res = await googleLoginInternal(idToken).unwrap();
          console.log("Login internal response--->", res);

          // Fetch favorites
          const favoriteVehicles = await getFavoriteVehicleIdsByUserId(
            res.userId
          );
          const favoriteVoyages = await getFavoriteVoyageIdsByUserId(
            res.userId
          );

          dispatch(
            updateUserFavorites({
              favoriteVehicles: favoriteVehicles.data,
              favoriteVoyages: favoriteVoyages.data,
            })
          );

          dispatch(
            updateAsLoggedIn({
              userId: res.userId,
              token: res.token,
              userName: res.userName,
              profileImageUrl: res.profileImageUrl,
            })
          );

          navigate("/");
        } catch (err) {
          console.error("Google login failed:", err);
        }
      }}
      onError={() => {
        console.error("Google login failed");
      }}
    />
  );
}
