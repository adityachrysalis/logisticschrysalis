import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BackgroundImage from '../assets/logistics1.jpg'
import Footer from "./Footer";

function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${apiUrl}send_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOtpRequested(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${apiUrl}verify_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        console.warn(data);
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("username", data.name);
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (


    <div className="absolute w-full" style={{ height: 'calc(90vh - 2px)' }}>
      {/* Background Image */}

      <img
        src={BackgroundImage}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover bg-opacity-100"
      />


      <div className="flex flex-col justify-center items-center h-[calc(100vh-20vh)] sm:mx-10 md:mx-10 px-2 relative z-10 space-y-6">
        <form
          className="bg-icbackgroundlight py-6 px-6 rounded-lg shadow-lg min-w-72 w-full max-w-md"
          onSubmit={isOtpRequested ? handleOtpSubmit : handleEmailSubmit}
        >
          <h1 className="text-center mb-6 font-bold text-xl text-gray-900">Login</h1>

          {!isOtpRequested ? (
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-icbackgroundlight border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                placeholder="name@email.com"
                required
              />
            </div>
          ) : (
            <div className="mb-6 justify-center">
              <label
                htmlFor="otp"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter OTP
              </label>
              <div className="flex gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="bg-gray-50 m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 w-12 h-12 text-center"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`text-icbackgroundlight bg-icbackground focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full px-5 py-3 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Sending OTP..." : isOtpRequested ? "Verify OTP" : "Get OTP"}
          </button>





        </form>

      </div>
      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

    </div>


  );
}

export default Login;
