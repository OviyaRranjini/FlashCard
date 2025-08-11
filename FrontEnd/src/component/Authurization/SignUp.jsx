import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import AuthInput from "./AuthInput";
import AuthTabs from "./AuthTabs";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (res.ok) {
        alert("Sign up successful! Please sign in.");
        navigate("/signin"); // ✅ Redirect to Sign In
       } 
      //  else {
      //   const data = await res.json();
      //   //alert("Signup failed: " + data.message);
      // }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <AuthLayout>
      <AuthTabs />
      <input
        className="bg-white w-full h-12 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#96acf7] required"
        type="text"
        placeholder="Name (Like: Mango...)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="bg-white w-full h-12 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#96acf7] required"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p
        onClick={handleSignUp}
        className="cursor-pointer w-full rounded-lg px-6 py-3 text-xl md:text-2xl text-center hover:opacity-90 bg-[#96acf7] text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#96acf7]"
      >
        Sign Up
      </p>
      <div className="bg-white border border-gray-300 w-full px-4 py-3 rounded-lg text-sm">
        <p>
          <span className="font-bold block mb-1">Disclaimer :</span>
          <span>
            If you forget your username or password, you will not be able to sign in. You will need to create a new account and restart the course from the beginning.
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
