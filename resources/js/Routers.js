import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import components directly
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import StudentIS from "./components/StudentIS";
import FacultyIS from "./components/FacultyIS";
import ClassScheduling from "./components/ClassScheduling";
import AcademicPrograms from "./components/AcademicPrograms";
import SubjectEnlistment from "./components/SubjectEnlistment";
import EnlistmentManager from "./components/EnlistmentManager";
import ClassroomManager from "./components/ClassroomManager";
import SystemSettings from "./components/SystemSettings";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Default route */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="student-is" element={<StudentIS />} />
        <Route path="faculty-is" element={<FacultyIS />} />
        <Route path="class-scheduling" element={<ClassScheduling />} />
        <Route path="academic-programs" element={<AcademicPrograms />} />
        <Route path="subject-enlistment" element={<SubjectEnlistment />} />
        <Route path="enlistment-manager" element={<EnlistmentManager />} />
        <Route path="classroom-manager" element={<ClassroomManager />} />
        <Route path="system-settings" element={<SystemSettings />} />
      </Routes>
    </Router>
  );
}

if (document.getElementById("root")) {
  ReactDOM.render(<Routers />, document.getElementById("root"));
}
