
import { useState } from "react";
import { auth, googleProvider, db } from "../services/firebase";
import { signInWithEmailAndPassword,  signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, } from "@heroicons/react/24/outline";
import fondo from "../assets/fondo.jpg";
import googleLogo from "../assets/g-logo.png";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "usuarios", user.email);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          estadoAnimo: "",
          preferencias: [],
        });
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Imagen de fondo */}
      <img
        src={fondo}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Capa oscura + blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Formulario */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Iniciar Sesión
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4 relative group">
          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3 group-focus-within:text-red-600 transition" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 relative group">
          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3 group-focus-within:text-red-600 transition" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-2.5 right-3 cursor-pointer text-gray-400 hover:text-red-600 transition"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 hover:scale-[1.01] active:scale-95 transition-transform duration-200 shadow-md"
        >
          Entrar
        </button>
        
        {/* Google login button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-2 rounded-md hover:shadow-md transition duration-200"
          >
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700 font-medium">
              Iniciar sesión con Google
            </span>
          </button>
        </div>


        <p className="text-sm text-center mt-6 text-gray-700">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}

