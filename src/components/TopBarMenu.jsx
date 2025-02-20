import "../assets/css/date-range-custom.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAsLoggedOut } from "../slices/UserSlice";
import { useState, useEffect } from "react";

export function TopBarMenu() {


  const [loggedInState, setIsLoggedInState] = useState(false);
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenInLocalStorage = localStorage.getItem("storedToken");
    if (tokenInLocalStorage) {
      setIsLoggedInState(true);
    } else if (isLoggedIn) {
      setIsLoggedInState(true);
    }
  }, [isLoggedIn]);



  const [showModal, setShowModal] = useState(false)
  return (
    <nav className="flex space-x-2 sm:space-x-2 overflow-x-auto sm:overflow-x-visible">
      {loggedInState ?
        <>
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
          {/* 
          <NavLink
            to="/newVehicle"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            CreateVehicle
          </NavLink> */}


          {/* <NavLink
            to="/newVoyage"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            New Voyage
          </NavLink> */}


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
            to="/edit-profile"
            className={({ isActive }) =>
              isActive
                ? `${activeStyle} ${commonStyle}`
                : `${inactiveStyle} ${commonStyle}`
            }
          >
            EditProfile
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

          <>
            <button
              onClick={() => {
                setShowModal(true)
              }}
              className={`${inactiveStyle} ${commonStyle}`}
            >
              Logout
            </button>

            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 style={{ color: "rgba(10, 119, 234,.7)", fontWeight: "bold" }}>Are you sure you want to log out?</h3>
                  <div className="modal-buttons">
                    <button onClick={() => {
                      dispatch(updateAsLoggedOut());
                      navigate("/login");
                    }} className="confirm-btn">
                      Yes, Logout
                    </button>
                    <button onClick={() => setShowModal(false)} className="cancel-btn">
                      No, Stay
                    </button>
                  </div>
                </div>
              </div>
            )}

            <style>
              {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
          }

          .modal-buttons {
            margin-top: 1rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
          }

          .confirm-btn {
            background: rgb(10, 119, 234);
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 1.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 1.8rem
          }

          .cancel-btn {
            background: rgb(34, 177, 76);
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 1.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 1.8rem
          }
        `}
            </style>
          </>
        </>
        : <>
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

        </>
      }

    </nav>
  );
}

const activeStyle = "text-white";
const inactiveStyle = "text-blue-500";
const commonStyle = "font-bold text-xl p-1 px-6 hover:bg-opacity-30 hover:bg-blue-800 hover:text-white hover:rounded-2xl";

