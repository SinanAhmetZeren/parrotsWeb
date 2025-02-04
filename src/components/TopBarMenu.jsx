import "../assets/css/date-range-custom.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";

export function TopBarMenu() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  return (
    <nav className="flex space-x-2 sm:space-x-2 overflow-x-auto sm:overflow-x-visible">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Profile
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Favorites
      </NavLink>
      <NavLink
        to="/connect"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Connect
      </NavLink>
      {/* <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Login
      </NavLink> */}

      {localStorage.getItem("storedToken") ? (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              dispatch(updateAsLoggedOut());
              navigate("/login");
            }
          }}
          className={`${inactiveStyle} ${commonStyle}`}
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? `${activeStyle} ${commonStyle}`
              : `${inactiveStyle} ${commonStyle}`
          }
        >
          Login
        </NavLink>
      )}
    </nav>
  );
}

const activeStyle = "text-white";
const inactiveStyle = "text-blue-500";
const commonStyle = "font-bold text-xl p-1 px-6 hover:bg-opacity-30 hover:bg-blue-800 hover:text-white hover:rounded-2xl";


