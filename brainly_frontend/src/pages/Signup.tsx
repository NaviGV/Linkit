import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import Button from "../components/ui/Button"; 
import Input from "../components/ui/Input";  


 
import { Link, useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import axiosInstance from "../utiils/axiosConfig";

const passwordCriteria = [ 
  { id: "length", text: "At least 8 characters", regex: /.{8,}/, met: false },
  { id: "uppercase", text: "At least one uppercase letter (A-Z)", regex: /[A-Z]/, met: false },
  { id: "lowercase", text: "At least one lowercase letter (a-z)", regex: /[a-z]/, met: false },
  { id: "number", text: "At least one number (0-9)", regex: /[0-9]/, met: false },
  { id: "special", text: "At least one special character (e.g., !@#$%)", regex: /[^A-Za-z0-9]/, met: false },
];

const Signup = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null); 
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [criteria, setCriteria] = useState(passwordCriteria);
  const [loading, setLoading] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  useEffect(() => {
    setCriteria(prevCriteria =>
      prevCriteria.map(criterion => ({
        ...criterion,
        met: criterion.regex.test(password),
      }))
    );
  }, [password]);

  const allCriteriaMet = criteria.every(criterion => criterion.met);

  async function handleSignupSubmit(event?: FormEvent) {
    if (event) event.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    if (!allCriteriaMet) {
      toast.error("Password does not meet all criteria.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `${BACKEND_URL}/api/v1/signup`,
        {
          username: username,
          password: password,
        }
      );
      toast.success("You have signed up! Please sign in.");

      setUsername("");
      setPassword("");
      setShowCriteria(false);
      navigate("/signin");

    } catch (err: any) {
      if (isAxiosError(err)) {
        if (err.response?.status === 400) {
          const errorMessage = err.response.data?.message || "Invalid input. Please check the requirements.";
          toast.error(errorMessage);
        } else if (err.response?.status === 409) {
            toast.error(err.response.data?.message || "Username already exists.");
             if (err.response.data?.message?.toLowerCase().includes("username already exists")) {
                usernameRef.current?.focus(); 
            }
        } else if (err.response?.status === 411) {
          toast.error("Username already exists. Please login.");
          navigate("/signin");
        } else if (err.response?.status === 422) {
          toast.error(err.response.data?.message || "Invalid username or password format.");
        } else if (err.response?.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        toast.error("Network error. Please check your internet connection.");
      } else if (err.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && allCriteriaMet && username && password && !loading) {
      handleSignupSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#e6dae6] flex flex-col justify-center items-center p-4">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Create an Account</h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-1">
          Join Brainly, the Linkit app
        </p>
      </div>

      <form
        onSubmit={handleSignupSubmit}
        className="w-full max-w-xs md:max-w-md rounded-lg border border-gray-300 bg-[#eceeef] p-6 sm:p-8 shadow-xl"
      >
        <div className="mb-5">
         
          <Input
            ref={usernameRef} 
            placeholder="Enter your username"
            type="text"
            id="username-signup"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-1">
          
          <Input
            ref={passwordRef} 
            placeholder="Create a strong password"
            type="password" 
            id="password-signup"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              if (!showCriteria) setShowCriteria(true);
            }}
            onFocus={() => setShowCriteria(true)}
            onKeyPress={handlePasswordKeyPress} 
            autoComplete="new-password" 
          />
        </div>

        {showCriteria && (
          <ul className="list-none pl-1 text-xs sm:text-sm space-y-1 my-3">
            {criteria.map(criterion => (
              <li
                key={criterion.id}
                className={`flex items-center transition-colors duration-300 ${criterion.met ? "text-green-600" : "text-red-600"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 flex-shrink-0">
                  {criterion.met ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  )}
                </svg>
                {criterion.text}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            text="Sign Up"
            loading={loading}
            
            disabled={!allCriteriaMet || !username || !password || loading}
          />
          
        </div>

        <p className="text-sm text-center mt-6 text-gray-700">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;