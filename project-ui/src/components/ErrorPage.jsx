import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown === 0) {
        navigate('/');
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="mb-4">You entered in a wrong page. This page doesn't exits!</p>
        <p className="text-lg font-bold text-red-500 mb-6">
          Redirecting to the homepage in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;