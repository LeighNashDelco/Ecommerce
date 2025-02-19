import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Unauthorized from './Unauthorized';

const PrivateRoute = ({ children, roleRequired }) => {
  const { role } = useParams();
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));

  useEffect(() => {
    
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    setAuthToken(token);
    setUserRole(role);
  }, []); 

 
  if (!authToken || !userRole) {
    return <Navigate to="/login" replace />;
  }

  
  const isRoleValid = Array.isArray(roleRequired)
    ? roleRequired.includes(userRole)
    : userRole === roleRequired;

  
  if (role && role !== userRole) {
    return <Unauthorized />; 
  }

  if (!isRoleValid) {
    return <Unauthorized />; 
  }

  
  return children;
};

export default PrivateRoute;