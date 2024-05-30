import { useState, useContext } from "react";
import validation from "../handlers/loginHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

function Login() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [values, setValues] = useState({
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
    setErrors(validation(values));

    const validationErrors = validation(values);
    setErrors(validationErrors);

    // Check if there are no validation errors
    if (Object.values(validationErrors).every((error) => error === "")) {
      try {
        const response = await fetch(
          `http://localhost:8081/checker/${values.email}`
        );
        const data = await response.text();

        if (data === "0") {
          setErrors({
            ...errors,
            email: "E email registered nay, kindly age account kuloin!",
          });
        } else {
          const loginResponse = await axios.post(
            "http://localhost:8081/login",
            values
          );
          const userData = loginResponse.data;

          if (userData.success) {
            // Passwords match, user successfully logged in
            if(userData.isVerified === 0){
              alert("Apnar account bortomane check kora or, kindly ektu pore abr try korba!")
              navigate("/")
              return ;
            }
            if(userData.restricted === 1){
              alert("Apnar account restricted kora oise, kindly review er jonno opekka korba!");
              navigate("/")
              return ;
            }
            setCurrentUser({
              userLoggedIn: true,
              username: userData.username,
              isAdmin: userData.isAdmin,
            });
            alert("You are successfully logged in!");
            navigate(`/profile`);
          } else {
            setErrors({ ...errors, password: "Password bhul!" });
          }
        }
      } catch (error) {
        console.error("Error checking email:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center">
      <div className="bg-green-500 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Login - Shobai apnar lagi opekka korer!
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
              onChange={handleInput}
            />
            {errors.email && <span className="text-black">{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-white">
              Password Cheker12kkk
            </label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
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
            Login
          </button>
        </form>

        <div className="mt-4 text-white">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="underline">
              Create new account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
