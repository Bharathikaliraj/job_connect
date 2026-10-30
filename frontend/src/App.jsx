
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./compontents/navbar";
import Home from "./pages/home";
import JobDetails from "./pages/jobdetails";
import MyApplications from "./pages/myapplications";
import Login from "./pages/login";
import Register from "./pages/register";
import RecruiterDashboard from "./pages/recruiterdashboard";
import MyPostedJobs from "./pages/mypostedjobs";
import RecruiterApplications from "./pages/recruiterapplications";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/job/:id" element={<JobDetails />} />


        <Route
          path="/my-applications"
          element={<MyApplications />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
        path="/recruiter-dashboard"
      element={<RecruiterDashboard />}
    />
      <Route
  path="/my-posted-jobs"
  element={<MyPostedJobs />}
/>
      <Route
  path="/recruiter-applications"
  element={<RecruiterApplications />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
