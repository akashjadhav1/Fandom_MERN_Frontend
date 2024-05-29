import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { auth, googleProvider, db } from '@/config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import fandom from '@/assets/fandomLogo.svg';
import google from '@/assets/google.svg';
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match', toastConfig);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        photoURL: null, // No photo URL for email/password users
      });

      // Navigate to login page
      navigate('/login');
      toast.success('Registration successful, please log in', toastConfig);
    } catch (error) {
      setError(error.message);
      toast.error(error.message, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create a user document in Firestore with the profile image URL
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL, // Include profile image URL
      });

      toast.success('User registered successfully', toastConfig);
      navigate('/login');
    } catch (error) {
      setError(error.message);
      toast.error(error.message, toastConfig);
    }
  };

  return (
    <div className="backgroundImage flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md m-auto mt-10 bg-gray-700 p-10 rounded shadow-black shadow-lg">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-center items-center">
          <img src={fandom} alt="fandom" className='w-[150px] text-center' />
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full rounded" onClick={signUpWithGoogle}>
            <img src={google} alt="google" className='' /> <p className='mx-2'>Sign Up with Google</p>
          </Button>
        </div>
        <div className="flex justify-center items-center mt-4">
          <div><p className="border border-b-2 w-[100px] mx-1"></p></div>
          <p>OR CONTINUE WITH</p>
          <div><p className="border border-b-2 w-[100px] mx-1"></p></div>
        </div>
        <form onSubmit={handleSignUp}>
          <div className="mt-5">
            <Label>Name</Label>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Label>Password</Label>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Label>Confirm Password</Label>
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Button
              variant="outline"
              className="mt-5 w-full rounded"
              type="submit"
              disabled={loading}
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
