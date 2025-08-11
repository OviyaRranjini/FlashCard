import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import AuthTabs from "./AuthTabs";

const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ❗ Must include this for sessions to work
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Sign in successful!");
      navigate("/course");
    } else {
      alert("Sign in failed: " + data.message);
    }
  } catch (err) {
    console.error("Sign in error:", err);
    alert("Something went wrong. Please try again.");
  }
};
  
  
  return (
    <AuthLayout>
      <AuthTabs />
      <input
        className="bg-white w-full h-12 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#96acf7]"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="bg-white w-full h-12 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#96acf7]"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p
        onClick={handleSignIn}
        className="cursor-pointer w-full rounded-lg px-6 py-3 text-xl md:text-2xl text-center hover:opacity-90 bg-[#96acf7] text-white font-bold"
      >
        Sign In
      </p>
    </AuthLayout>
  );
};

export default SignIn;
