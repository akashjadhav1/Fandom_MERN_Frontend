import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import fandom from '@/assets/fandomLogo.svg';

import { useNavigate } from 'react-router-dom';

function Register() {
  // State variables to manage input fields and their values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // State to manage error messages
  const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); // React Router's hook for navigation

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

  // Function to handle the form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match', toastConfig);
      return;
    }
    setLoading(true); // Set loading to true while making the request
    try {
      const response = await axios.post('https://fandom-mern.onrender.com/api/user/register', {
        name,
        email,
        password
      });
      // Check if the registration was successful
      if (response.status === 201) {
        toast.success('Registration successful, please log in', toastConfig);
        navigate('/login'); // Navigate to the login page
      } else {
        throw new Error('Registration failed'); // Throw error if registration failed
      }
    } catch (error) {
      setError(error.message); // Set error state
      toast.error(error.message, toastConfig); // Show error toast
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className="backgroundImage flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md m-auto mt-10 bg-slate-900 p-10 rounded shadow-black shadow-lg">
        
        <div className="flex justify-center items-center">
          <img src={fandom} alt="fandom" className='w-[150px] text-center' />
        </div>
        
        <form onSubmit={handleSignUp}>
          <div className="mt-5">
            <Label>Name</Label>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update name state on change
            />
          </div>
          <div className="mt-5">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on change
            />
          </div>
          <div className="mt-5">
            <Label>Password</Label>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state on change
            />
          </div>
          <div className="mt-5">
            <Label>Confirm Password</Label>
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state on change
            />
          </div>
          <div className="mt-5">
            <Button
              variant="outline"
              className="mt-5 w-full rounded"
              type="submit"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Signing Up...' : 'Sign Up'} 
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
