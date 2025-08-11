// src/component/LogOut/useAutoLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const confirmLogout = window.confirm("You've been inactive. Do you want to log out?");
        if (confirmLogout) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          navigate("/signin");
        }
      }, timeout);
    };

    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // beforeUnload: logout on close or reload
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    resetTimer(); // start timer on mount

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate, timeout]);
};

export default useAutoLogout;
