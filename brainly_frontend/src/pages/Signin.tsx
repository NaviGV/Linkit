import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent} from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { isAxiosError } from "axios";

import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utiils/axiosConfig"; 
import toast from "react-hot-toast";


const Signin = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  async function handleSigninSubmit(event?: FormEvent) {
    if (event) event.preventDefault(); 
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/api/v1/signin`, 
        {
          username, 
          password,
        }
      );

      const jwt = response.data.token;
      localStorage.setItem("token", jwt); 
      toast.success('Welcome back! Login successful');

      
      setUsername("");
      setPassword("");

      navigate("/dashboard");

    } catch (err: any) {
      if (isAxiosError(err)) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          
          toast.error(err.response.data?.message || "Incorrect username or password.");
          passwordRef.current?.focus(); 
          setPassword("");
        } else if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        toast.error("Network error. Please check your internet connection.");
      } else if (err.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Signin error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && username && password && !loading) {
      handleSigninSubmit();
    }
  };

  return (
    <>
      <div className="min-h-screen w-full md:w-screen flex flex-col justify-center items-center bg-[#e6dae6] p-4">
        <div className="text-center mb-6 sm:mb-8"> {/* Consistent title section */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Welcome back to Brainly
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mt-1">
            Sign in to Linkit
          </p>
        </div>

        <form
          onSubmit={handleSigninSubmit}
          className="w-full max-w-xs md:max-w-md rounded-lg border border-gray-300 bg-[#eceeef] p-6 sm:p-8 shadow-xl" >

          <div className="mb-5">
            <Input
              ref={usernameRef}
              placeholder="Enter your username"
              type="text"
              id="username-signin" 
              value={username} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-7">
            <Input
              ref={passwordRef}
              placeholder="Enter your password"
              type="password"
              id="password-signin" 
              value={password} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onKeyPress={handlePasswordKeyPress}
              autoComplete="current-password"
            />
          </div>

          <div className="mt-6 flex justify-center"> 
            <Button
              variant="primary"
              text="Sign In" 
              loading={loading}
             
              disabled={!username || !password || loading} 
            />
          </div>

          <p className="text-sm text-center mt-6 text-gray-700"> 
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Sign up instead
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signin;
