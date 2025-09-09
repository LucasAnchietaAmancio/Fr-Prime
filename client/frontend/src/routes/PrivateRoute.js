import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiVerifyToken } from "../api/EndpointsApi";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
    try{
      const response = await apiVerifyToken();
      if (response.status === 200) {
        setIsValid(true);
      }
    }
    catch(error){
      console.log("Token inválido ou ausente:", error);
      setIsValid(false);
    }
    setLoading(false);
    };
    checkToken();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                 <CircularProgress />
           </Box>

    
  }

  return isValid ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
