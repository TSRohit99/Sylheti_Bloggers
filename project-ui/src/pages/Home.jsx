import React, { useState, useEffect } from "react";
import Blogs from "./Blogs";
import About from "./About";

function Home() {
  const backgroundImages = [
    "/assets/bgrm.jpg",
    "/assets/bgrm1.jpg",
    "/assets/bgrm2.jpg",
    "/assets/bgrm3.jpg",
    "/assets/bgrm4.jpg",
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handlePreviousImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div
        className="h-[45vh] md:h-[80vh] bg-cover bg-no-repeat bg-center "
        style={{
          backgroundImage: `url(${backgroundImages[activeImageIndex]})`,
        }}
      >
        <div className="absolute w-[35vh] md:w-auto top-1/3 md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-2 md:p-8 rounded-lg bg-black/20">
          <h1 className="text-2xl md:text-6xl font-bold">
            Kita Bha <span className="text-red-600">Sylethi</span> Okl?
          </h1>
          <p className="text-xs md:text-xl text-white">
          আফনারার ব্লোগ্গিং পেজ ও স্বাগতম, ইনহ আপনারা মন খুলিয়া ব্লগ লেখতে পারবা আর নিজর মতামত দিতে পারবা!
          </p>
        </div>
        <button
          className="absolute top-1/3 md:top-1/2  left-3 transform -translate-y-1/2 bg-black/55 text-white p-2 rounded"
          onClick={handlePreviousImage}
        >
          &larr;
        </button>
        <button
          className="absolute top-1/3 md:top-1/2  right-3 transform -translate-y-1/2 bg-black/55 text-white p-2 rounded"
          onClick={handleNextImage}
        >
          &rarr;
        </button>
      </div>
     <Blogs />
     <About />
    </>
  );
}

export default Home;
