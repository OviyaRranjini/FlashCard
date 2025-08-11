// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./component/Authurization/SignUp";
import SignIn from "./component/Authurization/Login";
import Home from "./component/Home";
import Course from "./component/Course/Course";
import CourseAdd from "./component/Course/CourseAdd";
import Progress from "./component/Progress/Progress";
import ContentAdd from "./component/Progress/ContentOfCourses";
import CourseContent from "./component/Course/CoursesContent";
import Question from "./component/Questions/Questiones";
import Notification from "./component/Notifications/Notification";
import AnswerPage from "./component/Questions/Answers";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/course" element={<Course />} />
      <Route path="/question" element={<Question />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/courseadd" element={<CourseAdd />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/questions/:id" element={<AnswerPage />} />
      <Route
        path="/contentadd/:courseId/:username/:courseName"
        element={<ContentAdd />}
      />
      <Route path="/:courseId/:courseName" element={<CourseContent />} />
    </Routes>
  );
};

export default App;
