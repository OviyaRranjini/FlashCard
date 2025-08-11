import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md flex justify-center items-center">
        <div className="flex flex-col w-full justify-center items-center">
          <div className="px-5 py-8 flex flex-col gap-5 justify-center items-center rounded-3xl bg-[#bcebf6] w-full shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
