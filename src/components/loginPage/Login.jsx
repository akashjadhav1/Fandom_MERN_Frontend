import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // Import React Hook Form
import { Link } from 'react-router-dom';
import google from "@/assets/google.svg";
import fandom from '@/assets/fandomLogo.svg'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize React Hook Form
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (data) => { // Use data argument to access form data
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("User logged in successfully");
      setError(null); // Clear error if login is successful
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md m-auto bg-gray-700 p-10 rounded shadow-md">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center items-center">
          <img src={fandom} alt="fandom" className='w-[150px] text-center' />
        </div>
        <div className="mt-4 mb-4">
          
          <Button variant="outline" className="w-full rounded" onClick={signInWithGoogle}>
          <img src={google} alt="google" /><p className='mx-2 rounded'>Login with Google</p>
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <div><p className="border border-b-2 w-[100px] mx-1"></p></div>
          <p>OR CONTINUE WITH</p>
          <div><p className="border border-b-2 w-[100px] mx-1"></p></div>
        </div>
        <form onSubmit={handleSubmit(handleSignIn)}> {/* Use handleSubmit from React Hook Form */}
          <div className="mt-5">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              outline="none"
              {...register('email', { required: true })} // Use register to bind input fields
            />
            {errors.email && <p className="text-red-500">Email is required</p>} {/* Display error message if email is not provided */}
          </div>
          <div className="mt-5">
            <Label>Password</Label>
            <Input
              placeholder="Password"
              type="password"
              {...register('password', { required: true })} // Use register to bind input fields
            />
            {errors.password && <p className="text-red-500">Password is required</p>} {/* Display error message if password is not provided */}
          </div>
          <div>
            <Button
              variant="outline"
              className="mt-5 w-full rounded"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="flex justify-center mt-2">
              <p>New To Fandom </p>
              <Link to="/register" className="text-blue-500 underline mx-2">Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
