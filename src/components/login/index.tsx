import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../services/auth/authSlice'; // Adjust the import path for your store
import { Loader } from 'lucide-react'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Dummy loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log email and password for now
    console.log('Email:', email);
    console.log('Password:', 'anyoldpasswilldo');

    // Set loading state
    setIsLoading(true);

    // Simulating an API call or authentication process
    setTimeout(() => {
      dispatch(setCredentials({ token: 'fakeToken' })); // Replace 'fakeToken' with a real token if needed
      setIsLoading(false); // Reset loading state after the process
      navigate('/dashboard'); // Redirect after login
    }, 750);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-sm p-8 bg-[#edf5ff] shadow-lg rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center">
            {isLoading && 
              <>
                <h2 className="text-2xl font-bold text-left mb-6">Logging you into the Universe...</h2>
                <Loader className="animate-spin" />
              </>}
          </div>
        ) : (
          <div className="flex flex-col justify-between mb-20 max-w-[400px] w-full text-[#003171]">


            <h2 className="text-2xl font-normal text-left mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="loginInput"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <input type="checkbox" name="rememberMe" />
                <label htmlFor="rememberMe" className='pl-2'>Remember Me</label>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 mt-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                  disabled={isLoading} // Disable button when loading
                >
                  NEXT
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
