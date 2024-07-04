import { useState, useContext } from "react";
import validation from "../regex/loginHandler";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Profile from "../components/Profile";
import toast from 'react-hot-toast';

function Login() {
  const apiPrefix = "https://sylheti-bloggers.onrender.com";
  // const apiPrefix = 'http://localhost:8081'
  // const apiKey = import.meta.env.VITE_API_KEY_SELF
  const apiKey="IamYourFatherDamnNowGiveMeAccess";
  const header =  { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey 
      }
    }
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
 

  if (currentUser.username != "") {
    return <Profile />;
  }

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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
        const response = await fetch(`${apiPrefix}/checker/${values.email}`, header);
        const data = await response.text();

        if (data === "0") {
          setErrors({
            ...errors,
            email: "E email registered nay, kindly age account kuloin!",
          });
        } else {
          const loginResponse = await axios.post(`${apiPrefix}/login`, values, header);
          const userData = loginResponse.data;

          if (userData.success) {
            // Passwords match, user successfully logged in
            if (userData.isVerified === 0) {
              toast('Apnar account bortomane check kora or, kindly ektu pore abr try korba!', {
                icon: '⚠️',
              });
              navigate("/");
              return;
            }
            if (userData.restricted === 1) {
              toast('Apnar account restricted kora oise, kindly review er jonno opekka korba!', {
                icon: '⚠️',
              });
              navigate("/");
              return;
            }
            setCurrentUser({
              userLoggedIn: true,
              username: userData.username,
              isAdmin: userData.isAdmin,
            });
            toast.success("You are successfully logged in!");
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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full rounded-md px-4 py-2 bg-gray-200 focus:outline-none focus:bg-white"
              onChange={handleInput}
            />

           <p>Show Password <input type="checkbox" onClick={togglePasswordVisibility} /> </p>

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
