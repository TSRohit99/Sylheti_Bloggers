import React, { useState , useContext} from "react";
import validation from "../regex/signupHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Profile from "../components/Profile"


function SignUp() {
  const { currentUser } = useContext(UserContext);
  if(currentUser.username!= ""){
    return <Profile />
  }
  const [values, setValues] = useState({
    name: "",
    area: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setErrors(validation(values));

    const validationErrors = validation(values);
    setErrors(validationErrors);

    // Check if there are no validation errors
    if (Object.values(validationErrors).every((error) => error === "")) {
      try {
        const response = await fetch(
          `http://localhost:8081/checker/${values.email}`
        );
        const data = await response.text();

        if (data === "1") {
          setErrors({
            ...errors,
            email: "E email dia already ekta account ace!",
          });
        } else  {
          const signupResponse = await axios.post(
            "http://localhost:8081/signup",
            values
          );
          alert("You have successfully registered, verfication pending ace, verfication approve oile login korte parva!");
          // navigate("/login");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking email:", error);
      }
    }
  };

  return (
    <div className="  min-h-screen bg-gray-300 flex justify-center items-center">
      <div
        className="bg-green-500 p-8 rounded-lg shadow-lg"
        style={{ width: "350px", marginTop: "7%" }}
      >
        <h2 className="text-2xl font-semibold mb-4">
          Sign Up - Blogging koria dekai din shobre!
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname" className="block text-white">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
              name="name"
              onChange={handleInput}
            />
            {errors.name && <span className="text-black">{errors.name}</span>}
          </div>
          <div>
            <label htmlFor="area" className="block text-white">
              Area
            </label>
            <input
              type="text"
              id="area"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
              name="area"
              onChange={handleInput}
            />
            {errors.area && <span className="text-black">{errors.area}</span>}
          </div>
          <div>
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
              name="email"
              onChange={handleInput}
            />
            {errors.email && <span className="text-black">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-white">
              Password (must include a Cap letter, number and length greater
              than 8)
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
              name="password"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-black">{errors.password}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-white">
          <p>
            Already have an account?{" "}
            <a href="/login" className="underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
