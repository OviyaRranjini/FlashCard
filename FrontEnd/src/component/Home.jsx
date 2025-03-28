import React from 'react';
import flashcardSymbole from '../assets/FlashCardSymbol.png';

const Home = () => {
  return (
    <div className="bg-[#edf1f3] flex flex-row h-screen w-screen justify-center text-center">
      <div className="flex-1/4"></div>
      <div className="bg-[#edf1f3] flex flex-2/4 md:flex-5/6 sm:flex-5/6 md:flex-3/4 lg:flex-3/4 xl:flex-2/4 justify-center items-center ">
        <div className="flex flex-col px-5 py-10 justify-center items-center ">
          <h2 className="text-4xl inline-flex items-center flex-col md:flex-row">
            Welcome to Flashcard
            <img
              className="w-auto h-8 px-2 md:h-15 sm:h-15 align-top md:ml-0 md:mr-8  sm:mt-5 md:mt-0"
              src={flashcardSymbole}
              alt="Symbol"
            />
          </h2>
          
      <div className="flex flex-col gap-5 justify-left items-center mt-5">
      <div className="flex flex-row gap-5 justify-left items-center mt-5">

          <div className="hover:bg-blue-800 transition-colors duration-1000 ease-in-out  hover:text-amber-50 flex flex-col flex-3/4 border rounded-lg justify-left items-center ">
          <p className="text-lg font-bold justify-start text-left px-5 pt-2">
            Learn 
            </p>
    <p className="text-lg text-left  px-3 py-2 md:block hidden">
         Explore courses across languages, 
         and more. Master
         new topics quickly.
    </p></div>
    <div className="hover:bg-blue-800 hover:text-amber-50 flex flex-col flex-3/4 border rounded-lg justify-left items-center ">
    <p className="text-lg font-bold justify-start text-left pt-2">
            Create 
            </p>
    <p className="text-lg  text-left px-2 py-2 md:block hidden">
        Design custom flashcards. 
        Tailor learning to your exact needs.
    </p>
    </div>
    </div>

    <div className="flex flex-row gap-5  justify-left items-center ">
    <div className="flex hover:bg-blue-800 hover:text-amber-50 flex-col flex-3/4 border rounded-lg justify-left items-center ">
    <p className="text-lg font-bold justify-start text-left px-5 pt-2">
            Ask 
            </p>

    <p className="md:block hidden text-lg text-left px-3 py-2">
         Connect with our expert community.  
         Get answers and learn together.
    </p></div>
    <div className="flex flex-col hover:bg-blue-800 hover:text-amber-50 flex-3/4 border rounded-lg justify-left items-center ">
    <p className="text-lg font-bold justify-start text-left px-5 pt-2">
            Track 
            </p>
    <p className="md:block hidden text-lg text-left  px-3 py-2">
      Monitor your progress with clear data. 
       Stay motivated and reach your goals.
    </p>
    </div>
    </div>
    </div>
          <div className="flex flex-row gap-5 justify-center items-center mt-5">


          {/* <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          Button
        </button>
        
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
          Button
        </button>
         */}

         <button className='bg-blue-800 border-blue-800 border-10'> Sign In </button>

          <button> Sign Up </button>

          </div>
          </div>
          </div>
      <div className="flex-1/4"></div>
    </div>
  );
};

export default Home;