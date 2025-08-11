import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUp = location.pathname === "/signup";

  return (
    <div className="flex flex-row justify-center items-center bg-white rounded-2xl">
      <span
        className={`text-2xl md:text-4xl px-3 py-2 md:px-5 md:py-3 rounded-2xl cursor-pointer ${
          isSignUp ? "bg-[#D9D9D9]" : ""
        }`}
        onClick={() => navigate("/signup")}
      >
        SignUp
      </span>
      <span
        className={`text-2xl md:text-4xl px-3 py-2 md:px-5 md:py-3 rounded-2xl cursor-pointer ${
          isSignUp ?"" : "bg-[#D9D9D9]"
        }`}
        onClick={() => navigate("/signin")}
      >
        SignIn
      </span>
    </div>
  );
};

export default AuthTabs;
