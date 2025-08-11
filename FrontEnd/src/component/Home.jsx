import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import flashcardSymbole from '../assets/FlashCardSymbol.png';

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div className="bg-[#edf1f3] flex flex-row h-screen w-screen justify-center text-center">
      <div className="flex-1/4"></div>
      <div className="bg-[#edf1f3] flex flex-2/4 md:flex-5/6 sm:flex-5/6 md:flex-3/4 lg:flex-3/4 xl:flex-2/4 justify-center items-center ">
        <div className="flex flex-col py-10 justify-center items-center ">
          <h2 className="text-4xl inline-flex items-center justify-center flex-col md:flex-row">
            Welcome to Flashcard
            <img
              className="w-auto h-8 px-2 md:h-15 sm:h-15 align-top md:ml-0 md:mr-8 sm:mt-5 md:mt-0"
              src={flashcardSymbole}
              alt="Symbol"
            />
          </h2>

          <div className="flex flex-col gap-5 justify-left items-center">
            <div className="flex flex-row gap-5 justify-left items-center mt-5">
              <div className="hover:bg-blue-800 transition-colors duration-1000 ease-in-out hover:text-amber-50 flex flex-col flex-3/4 border rounded-lg justify-left items-center ">
                <p className="text-lg font-bold justify-start text-left px-5 pt-2 sm:py-2 sm:px-3">
                  Learn
                </p>
                <p className="text-lg text-left px-3 py-2 md:block hidden">
                  Explore courses across languages, and more. Master new topics quickly.
                </p>
              </div>
              <div className="hover:bg-blue-800 transition-colors duration-1000 ease-in-out hover:text-amber-50 flex flex-col flex-3/4 border rounded-lg justify-left items-center ">
                <p className="text-lg font-bold justify-start text-left px-5 pt-2 sm:py-2 sm:px-2">
                  Create
                </p>
                <p className="text-lg text-left px-2 py-2 md:block hidden">
                  Create your own custom flashcards, Tailoring the learning experience exactly to you.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-5 justify-left items-center ">
              <div className="hover:bg-blue-800 transition-colors duration-1000 ease-in-out hover:text-amber-50 flex flex-col flex-3/4 border rounded-lg justify-left items-center ">
                <p className="text-lg font-bold justify-start text-left px-5 pt-2 sm:py-2 sm:px-5">
                  Ask
                </p>
                <p className="md:block hidden text-lg text-left px-3 py-2">
                  Connect with our expert community. Get answers and learn together.
                </p>
              </div>
              <div className="hover:bg-blue-800 transition-colors duration-1000 ease-in-out hover:text-amber-50 flex flex-col flex-3/4 border rounded-lg justify-left items-center ">
                <p className="text-lg font-bold justify-start text-left px-5 pt-2 sm:py-2 sm:px-3">
                  Track
                </p>
                <p className="md:block hidden text-lg text-left px-3 py-2">
                  Monitor your progress with clear data. Stay motivated and reach your goals.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-5 justify-center items-center mt-5">
            <p
              onClick={() => navigate('/signin')} // ✅ Navigate to SignIn
              className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white text-2xl font-bold w-10% h-15 flex justify-center items-center rounded-xl px-5 py-2"
            >
              Get Start
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1/4"></div>
    </div>
  );
};

export default Home;
