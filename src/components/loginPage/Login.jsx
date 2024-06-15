import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import fandom from '@/assets/fandomLogo.svg';

const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark"
};

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(null); // State to manage errors
  const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); // React Router's hook for navigation

  const handleSignIn = async (data) => {
    setLoading(true); // Set loading to true while making the request
    try {
      const response = await axios.post('https://fandom-mern.onrender.com/api/user/login', {
        email: data.email,
        password: data.password
      });

      if (response.status === 200) {
        const { token } = response.data; // Extract token from the response
        Cookies.set('authToken', token, { expires: 7, secure: true }); // Set token as cookie, expires in 7 days

        navigate('/'); // Navigate to the home page
        toast.success('User logged in successfully', toastConfig); // Show success toast
      } else {
        throw new Error('Login failed'); // Throw error if response status is not 200
      }
    } catch (error) {
      setError(error.message); // Set error state
      toast.error(error.message, toastConfig); // Show error toast
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className="backgroundImage flex items-center justify-center lg:min-h-screen p-4 lg:p-0">
      <div className="w-full max-w-md bg-gray-700 p-6 rounded shadow-black shadow-lg">
        <div className="flex justify-center items-center">
          <img src={fandom} alt="fandom" className='w-[100px] lg:w-[150px] text-center rounded' />
        </div>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div className="mt-5">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              autoComplete="email"
              outline="none"
              {...register('email', { required: true })} // Register email input with validation
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div className="mt-5">
            <Label>Password</Label>
            <Input
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: true })} // Register password input with validation
            />
            {errors.password && <p className="text-red-500">Password is required</p>} 
          </div>
          <div>
            <Button
              variant="outline"
              className="mt-5 w-full rounded"
              type="submit"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Logging in...' : 'Login'} 
            </Button>
            <div className="flex justify-center mt-2">
              <p>New To Fandom?</p>
              <Link to="/register" className="text-blue-500 underline mx-2">Register</Link> 
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
