const AuthInput = ({ type, placeholder }) => {
  return (
    <input
      className="bg-white w-full h-12 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#96acf7] required"
      type={type}
      placeholder={placeholder}
    />
  );
};

export default AuthInput;
