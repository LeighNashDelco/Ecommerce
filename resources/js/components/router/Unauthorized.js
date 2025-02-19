import React, { useState, useEffect } from 'react';
import { Result, Button, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const { Title, Text } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [timeLeft, setTimeLeft] = useState(10); // Initialize the timer with 10 seconds

  // Set up automatic redirect after 10 seconds
  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/'); // Redirect to the homepage when time is up
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease the time left by 1 second
    }, 1000);

    // Clean up interval on component unmount
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
    color: 'white',
    fontSize: '18px',
    border: '1px solid black',
    padding: '5px 10px',
    borderRadius: '5px',
  };

  return (
    <div style={backgroundStyle}>
      {/* Timer */}
      <div style={timerStyle}>
        <Text style={{ color: 'black' }}>Redirecting in {timeLeft}s...</Text>
      </div>

      <Result
        status="403"
        title={<Title style={{ color: 'black' }}>403</Title>}
        subTitle={<Text style={{ color: 'black' }}>Access to the requested resource is forbidden</Text>}
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