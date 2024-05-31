import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import google from "@/assets/google.svg";
import fandom from '@/assets/fandomLogo.svg'
import { toast } from 'react-toastify';

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (data) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("User logged in successfully");
      toast.success('User logged in successfully', toastConfig);
      navigate('/');
    } catch (error) {
      setError(error.message);
      toast.error(error.message,toastConfig)
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('User logged in successfully', toastConfig);
      navigate('/');
    } catch (error) {
      setError(error.message);
      toast.error(error.message,toastConfig);
    }
  };

  return (
    <div className="backgroundImage flex items-center justify-center lg:min-h-screen p-4 lg:p-0">
      <div className="w-full max-w-md bg-gray-700 p-6 rounded shadow-black shadow-lg">
        
        <div className="flex justify-center items-center">
          <img src={fandom} alt="fandom" className='w-[100px] lg:w-[150px] text-center rounded' />
        </div>
        <div className="mt-4 mb-4">
          <Button variant="outline" className="w-full rounded flex items-center justify-center" onClick={signInWithGoogle}>
            <img src={google} alt="google" className="w-6 h-6 mr-2" />
            <p className='mx-2'>Login with Google</p>
          </Button>
        </div>
        <div className="flex items-center mb-4">
          <div className="border-b border-gray-600 flex-grow mx-2"></div>
          <p className='text-sm'>OR CONTINUE WITH</p>
          <div className="border-b border-gray-600 flex-grow mx-2"></div>
        </div>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div className="mt-5">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              outline="none"
              {...register('email', { required: true })}
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div className="mt-5">
            <Label>Password</Label>
            <Input
              placeholder="Password"
              type="password"
              {...register('password', { required: true })}
            />
            {errors.password && <p className="text-red-500">Password is required</p>}
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
