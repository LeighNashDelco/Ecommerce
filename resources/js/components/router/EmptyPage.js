import React, { useState, useEffect } from 'react';
import { Result, Button, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate(); 
  const [timeLeft, setTimeLeft] = useState(10); 

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/'); 
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); 
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const backgroundStyle = {
    backgroundColor: 'white', // Set background color to white
    height: '100vh', 
    padding: '20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const timerStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'black',
    fontSize: '18px',
    border: '1px solid black',
    padding: '5px 10px',
    borderRadius: '5px',
  };

  return (
    <div style={backgroundStyle}>
      {}
      <div style={timerStyle}>
        <Text style={{ color: 'black' }}>Redirecting in {timeLeft}s...</Text>
      </div>

      {}
      <Result
        status="404"
        title={<Title level={1} style={{ color: 'black' }}>404</Title>}
        subTitle={<Text style={{ color: 'black' }}>Page Not Found</Text>}
        extra={
          <Button type="primary">
            <a href="/">Back to Home</a>
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;