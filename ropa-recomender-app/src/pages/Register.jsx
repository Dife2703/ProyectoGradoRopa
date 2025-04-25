
import { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, } from "@heroicons/react/24/outline";
import fondo from "../assets/fondo.jpg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "usuarios", email), {
        email,
        estadoAnimo: "",
        preferencias: [],
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
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
        onSubmit={handleRegister}
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

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Crear Cuenta
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4 relative group">
          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3 group-focus-within:text-blue-600 transition" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6 relative group">
          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3 group-focus-within:text-blue-600 transition" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-2.5 right-3 cursor-pointer text-gray-400 hover:text-blue-600 transition"
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
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 hover:scale-[1.01] active:scale-95 transition-transform duration-200 shadow-md"
        >
          Registrarse
        </button>

        <p className="text-sm text-center mt-6 text-gray-700">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
