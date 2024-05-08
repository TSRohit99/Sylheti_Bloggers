import React from "react";
import Blogs from "./Blogs";
import About from "./About";

function Home() {
  const backgroundImageUrl = "/assets/bgrm.jpg";

  return (
    <>
      <div
        className="h-[80vh] bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-10 rounded-lg bg-black/30">
          <h1 className="text-6xl font-bold">
            Kita Bha <span className="text-red-600">Sylethi</span> Okl?
          </h1>
          <p className="text-xl text-white">
            Afnarar blogging Page o sagotom, ino apnnara mon kulia Blog lekte
            parva r nijor motamot dite parva!
          </p>
        </div>
      </div>

      <Blogs />
      <About />
    </>
  );
}

export default Home;
