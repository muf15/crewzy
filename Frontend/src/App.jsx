import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminRegistration from './Components/AdminForm/AdminRegistration';
import Login from "./Pages/Auth/login.jsx";
import EmployerRegisterPage from './Pages/Employer_Register/Employer.jsx';
import AdminDashboard from './Components/Dashboard/AdminDashboard.jsx';
import HybridEmployeeAdminPage from './Components/Hybrid/Employeehybrid.jsx';
import Navbar from './Components/Navbar/Navbar';
import AIAdmin from './Components/AIBOT/AIAdmin.jsx';
import HeroLanding from './Components/Landing/HeroLanding.jsx';
import AdminTaskManagementPage from './Components/Admin-task-management/AdminTaskManagementPage.jsx';
import UserLocation from './Components/AdminForm/UserLocation.jsx';
import OfficeEmployeePage from './Components/Office_Employee/OfficeEmployeePage.jsx';
const Home = () => (
  <div className="min-h-screen">
    <HeroLanding />
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE]">
    
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#4786FA] mb-4">
            Welcome to Crewzy
          </h1>
          <p className="text-[#4786FA] text-lg mb-8">Your organization management platform</p>
          <div className="space-x-4">
            <Link 
              to="/admin-dashboard" 
              className="bg-[#4786FA] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-block hover:bg-[#3B75E8]"
            >
              Admin Dashboard
            </Link>
            <Link 
              to="/admin-registration" 
              className="bg-[#FFFFFF] text-[#4786FA] border-2 border-[#4786FA] px-6 py-3 rounded-2xl font-semibold hover:bg-[#F4F7FF] transition-all duration-300 inline-block"
            >
              Admin Registration
            </Link>
            <Link 
              to="/demo" 
              className="bg-[#FFFFFF] text-[#4786FA] border-2 border-[#4786FA] px-6 py-3 rounded-2xl font-semibold hover:bg-[#F4F7FF] transition-all duration-300 inline-block"
            >
              Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Demo = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE]">
  
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#4786FA] mb-4">Demo Component</h1>
        <p className="text-[#4786FA] mb-8">This is a demo route for testing React components.</p>
        <Link 
          to="/" 
          className="bg-[#4786FA] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-block hover:bg-[#3B75E8]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/admin-registration" element={<AdminRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee" element={<EmployerRegisterPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/hybrid" element={<HybridEmployeeAdminPage />} />
        <Route path="/admin-task" element={<AdminTaskManagementPage />} />
        <Route path="/office" element={<OfficeEmployeePage />} />
        <Route path="/dashboard" element={<OfficeEmployeePage />} />
      
       
      </Routes>
    </Router>
  );
}

export default App
