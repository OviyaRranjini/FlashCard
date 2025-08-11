import React from 'react';
import NavBar from "../NavBar";
import CoursesProgress from './CoursesProgress';
import ReactionProgress from './ReactionProgress';
import Questions from './QuestionProgress';

const Progress = () => {
  return (
    <>
      <NavBar />

      <div className="fixed top-[100px] rounded-2xl left-[10%] right-[10%] h-[calc(100vh-100px)] overflow-y-auto bg-gray-100 px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <CoursesProgress />
          <ReactionProgress />
          <Questions />
        </div>
      </div>
    </>
  );
};

export default Progress;
