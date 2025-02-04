import { setCredentials } from "@/api/auth/authSlice";

// Adjust the import path for your store
import { useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Dummy loading state
  const [isError, setIsError] = useState(false); // Dummy loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let username = email.split("@")[0].split(".")[0];

    // Capitalize the first letter
    username = username.charAt(0).toUpperCase() + username.slice(1);

    // Basic validation for findest email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@findest\.eu$/;
    if (!emailRegex.test(email)) {
      setIsError(true);
      return; // Prevent form submission if email is invalid
    }

    // Set loading state
    setIsLoading(true);

    // Simulating an API call or authentication process
    setTimeout(() => {
      dispatch(
        setCredentials({ user: username, token: import.meta.env.VITE_ACCESS_TOKEN, email: email }),
      );
      setIsLoading(false); // Reset loading state after the process
      navigate("/dashboard"); // Redirect after login
    }, 750);
  };

  return (
    <div className="flex h-full items-center justify-center bg-white">
      <div className="flex w-full max-w-[400px] flex-col justify-between rounded-md p-[30px] text-[#006A86] shadow-[0_1px_4px_#b7b8d8]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            {isLoading && (
              <>
                <h2 className="mb-6 text-left text-2xl font-bold">Powering up...</h2>
                <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#006A86"
                  secondaryColor="#84A7E2"
                  radius="12.5"
                  ariaLabel="mutating-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </>
            )}
          </div>
        ) : (
          <div className="mb-0 flex w-full max-w-[500px] flex-col justify-between text-gray-700">
            <h2 className="mb-6 text-center text-2xl font-bold">Sign into your Universe</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                id="email"
                name="email"
                className="loginInput py-2"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {isError && (
                <p className="-mt-8 text-red-500">* Please enter a valid email address.</p>
              )}

              <div>
                <input type="checkbox" name="rememberMe" />
                <label htmlFor="rememberMe" className="pl-2 text-gray-400">
                  Remember Me
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-[#006A86] py-2 text-white hover:bg-[#84A7E2] focus:outline-none"
                  disabled={isLoading} // Disable button when loading
                >
                  LOG IN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
