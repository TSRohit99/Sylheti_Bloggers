import React from "react";
import Footer from "/src/components/Footer";

function About() {
  return (
    <>
      <h1 className="text-5xl text-black text-center mt-20 mb-4">
        About This Platform
      </h1>
      <div className="flex">
        <div>
          <img
            src="/assets/roh.jpeg"
            className=" rounded-lg w-72 h-96 ml-12 flex-1 mb-4"
          />
        </div>
        <div className="flex-1 ml-24 mr-6 mt-8">
          <p className="text-lg">
            {" "}
            Hello Dear Sylheties, welcoming you to my project "Sylethi
            Bloggers". I am a CSE student at North East University Bangladesh.
            This project is implementation of my DBMS and react.js knowledge.{" "}
            <br />
            <br />
            My vision for this platform is to establish a website that champions
            freedom of speech, providing a space for native Sylhetis to
            articulate their thoughts and share their diverse experiences.
            Whether you wish to contribute travel blogs, delve into the
            ever-popular "London Jauha," explore local food recipes, or uncover
            the history of our beloved Sylhet, this platform welcomes it all.
            <br />
            <br />
            Feel free to post your blogs, comment on others' posts, and enjoy
            the world of blogging together. <br /> Happy Blogging!{" "}
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default About;
