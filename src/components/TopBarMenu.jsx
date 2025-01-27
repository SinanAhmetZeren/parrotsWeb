import "../assets/css/date-range-custom.css";
import { NavLink } from "react-router-dom";

export function TopBarMenu() {
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
        to="/voyage-details"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Voyages
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
      <NavLink
        to="/logout"
        className={({ isActive }) =>
          isActive
            ? `${activeStyle} ${commonStyle}`
            : `${inactiveStyle} ${commonStyle}`
        }
      >
        Logout
      </NavLink>
    </nav>
  );
}

const activeStyle = "text-white";
const inactiveStyle = "text-blue-500";
const commonStyle = "font-bold text-xl p-1 px-6 hover:bg-opacity-30 hover:bg-blue-800 hover:text-white hover:rounded-2xl";


