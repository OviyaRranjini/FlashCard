import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import flashcardSymbole from "../assets/FlashCardSymbol.png";
import DaliyProgress from "../assets/svg_449113.svg";
import coursesIcon from "../assets/course-4.svg";
import questionIcon from "../assets/QuestionSymbol.png";
import notificationIcon from "../assets/notification.png";

const NavBar = () => {
  const [userName, setUserName] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        credentials: "include", // must include this for cookies to work
      });

      if (res.ok) {
        const data = await res.json();
        setUserName(data.name);
      } else {
        console.warn("Not logged in");
      }
    } catch (err) {
      console.error("Error fetching session user:", err);
    }
  };

  fetchUser();
}, []);


  const handleUserClick = () => {
    setShowLogout((prev) => !prev);
  };

 const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include", // 🔑 important for session cookies
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  setShowLogout(false);
  navigate("/");
};

  const linkBaseClass =
    "flex items-center px-3 py-2 rounded-lg transition-all duration-300 ease-in-out text-sm md:text-base";
  const defaultLinkClass =
    "bg-white/10 text-white border border-white/20 hover:bg-white/20";
  const activeLinkClass =
    "bg-white text-blue-700 shadow-lg border border-white";
  const textClass = "hidden lg:block font-bold ml-2";

  return (
    <div className="fixed top-0 left-0 w-screen h-20 flex justify-center items-start z-50">
      <div className="w-11/12 md:w-10/12 m-5 h-12 rounded-full bg-blue-500/30 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 shadow-2xl border border-blue-300/50 relative overflow-visible">
        <div
          className="absolute inset-0 z-0 pointer-events-none rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% -20%, rgba(255,255,255,0.1) 0%, transparent 80%)",
            filter: "blur(30px)",
          }}
        ></div>

        {/* Logo */}
        <div className="flex items-center flex-shrink-0 z-10">
          <div className="rounded-full bg-white w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center mr-2 shadow-inner">
            <img
              src={flashcardSymbole}
              alt="Flashcard Symbol"
              className="w-5 h-8 sm:w-6 sm:h-9 object-contain"
            />
          </div>
          <p className="hidden sm:block font-extrabold text-xl sm:text-2xl text-white tracking-wide">
            Flashcard
          </p>
        </div>

        {/* Links */}
        <nav className="flex-grow flex justify-center gap-2 sm:gap-4 mx-2 sm:mx-4 z-10">
          <NavLink
            to="/course"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeLinkClass : defaultLinkClass}`
            }
          >
            <img src={coursesIcon} alt="Courses" className="h-5 w-5 flex-shrink-0" />
            <p className={textClass}>Courses</p>
          </NavLink>

          <NavLink
            to="/question"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeLinkClass : defaultLinkClass}`
            }
          >
            <img src={questionIcon} alt="Questions" className="h-6 w-6 flex-shrink-0" />
            <p className={textClass}>Questions</p>
          </NavLink>

          <NavLink
            to="/notification"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeLinkClass : defaultLinkClass}`
            }
          >
            <img src={notificationIcon} alt="Notifications" className="h-5 w-5 flex-shrink-0" />
            <p className={textClass}>Notifications</p>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `${linkBaseClass} ${isActive ? activeLinkClass : defaultLinkClass}`
            }
          >
            <img src={DaliyProgress} alt="Progress" className="h-6 w-6 flex-shrink-0" />
            <p className={textClass}>Progress</p>
          </NavLink>
        </nav>

        {/* Profile and Logout */}
        <div className="relative inline-block flex-shrink-0 z-20">
          <div
            className="flex items-center cursor-pointer group"
            onClick={handleUserClick}
          >
            <div className="rounded-full bg-white w-9 h-9 sm:w-10 sm:h-10 flex justify-center items-center mr-2 shadow-inner group-hover:scale-105 transition-transform duration-200">
              <span className="text-blue-500 font-bold text-lg sm:text-xl">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <p className="hidden lg:block font-bold text-base sm:text-lg text-white group-hover:text-blue-200 transition-colors duration-200">
              {userName || "User Name"}
            </p>
          </div>

          {showLogout && (
            <div
              className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl py-2 px-4 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors duration-200 z-30 whitespace-nowrap border border-gray-200"
              onClick={handleLogout}
            >
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
