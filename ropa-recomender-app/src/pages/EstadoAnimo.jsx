// src/pages/EstadoAnimo.jsx
import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const emotionLabels = {
  happy: "Feliz😊",
  sad: "Triste😢",
  angry: "Molesto😡",
  surprised: "Sorprendido😲",
  fearful: "Miedoso😨",
  disgusted: "Disgustado🤢",
  neutral: "Neutral😐",
};

const emotionColors = {
  happy: "bg-yellow-100 border-yellow-500",
  sad: "bg-blue-100 border-blue-500",
  angry: "bg-red-100 border-red-500",
  surprised: "bg-purple-100 border-purple-500",
  fearful: "bg-indigo-100 border-indigo-500",
  disgusted: "bg-green-100 border-green-500",
  neutral: "bg-gray-100 border-gray-400",
};

const colorOptions = {
  red: "Rojo 🔴",
  blue: "Azul 🔵",
  black: "Negro ⚫️",
  yellow: "Amarillo 🟡",
  green: "Verde 🟢",
  purple: "Morado 🟣",
  white: "Blanco ⚪️",
};

const borderColors = {
  red: "border-red-500",
  blue: "border-blue-500",
  black: "border-gray-800",
  yellow: "border-yellow-400",
  green: "border-green-500",
  purple: "border-purple-500",
  white: "border-gray-300",
};

const bgColors = {
  red: "bg-red-100",
  blue: "bg-blue-100",
  black: "bg-gray-300",   // no hay bg-black-100, uso gris clarito
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  purple: "bg-purple-100",
  white: "bg-white",
};

const EstadoAnimo = () => {
  const { usuario } = useAuth();
  const [estadoAnimo, setEstadoAnimo] = useState("");
  const [colorPreferido, setColorPreferido] = useState("");
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch {
      alert("No se pudo acceder a la cámara.");
    }
  };

  const detectEmotion = async () => {
    setDetectedEmotion(null);
    if (videoRef.current) {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const emotion = Object.entries(detections.expressions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0];

        setDetectedEmotion(emotion);
        setEstadoAnimo(emotion);
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
      } else {
        alert("No se detectó ninguna cara, intenta de nuevo.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!detectedEmotion) {
      alert("Primero debes detectar tu emoción.");
      return;
    }

    if (!estadoAnimo || !colorPreferido) {
      alert("Por favor completa todas las selecciones.");
      return;
    }

    try {
      const docRef = doc(db, "usuarios", usuario.email);
      await updateDoc(docRef, {
        estadoAnimo,
        colorPreferido,
        emocionDetectada: detectedEmotion,
      });
      console.log("Datos guardados en Firestore");
      navigate("/");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert("Hubo un problema al guardar los datos.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-10">
      {/* Cámara y controles */}
      <div className="mb-5 flex flex-col items-center w-full max-w-md -mt-3">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full max-w-xs h-auto rounded-lg bg-black mb-5"
        />

        <div className="flex flex-wrap gap-4 justify-center w-full">
          <button
            onClick={startCamera}
            className="flex-1 min-w-[140px] bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Activar Cámara{" "}
            <span
              className="inline-flex items-center leading-none relative text-xl sm:text-3xl"
              style={{ top: '-4px' }} // 1px más abajo que antes
            >
              📷
            </span>
          </button>
          <button
            onClick={detectEmotion}
            className="flex-1 min-w-[140px] text-white px-5 py-3 rounded-lg transition flex items-center justify-center gap-2 whitespace-nowrap sm:px-5 bg-gray-500 hover:bg-gradient-to-r hover:from-pink-400 hover:via-purple-400 hover:to-indigo-500"
            // px-6 para móvil (más a la derecha), sm:px-5 para escritorio que vuelva a 5
          >
            Detectar Emoción{""}
            <span
              className="inline-flex items-center leading-none relative text-xl sm:text-3xl"
              style={{ top: '-1px' }}
            >
              😝
            </span>
          </button>
        </div>

        {/* Popup */}
        {showPopup && detectedEmotion && (
          <div className="mt-6 bg-white border border-gray-300 px-5 py-3 rounded-lg text-center max-w-xs mx-auto shadow-sm animate-fade-in-out">
            <p className="text-lg font-semibold text-gray-700">
              Según mi análisis, tu emoción es:{" "}
              <span className="text-blue-600">{emotionLabels[detectedEmotion]}</span>
            </p>
          </div>
        )}
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          ¿Cómo te sientes hoy?
        </h2>

        <div className="bg-gray-100 rounded-xl p-5 mb-8">
          <fieldset>
            <legend className="text-xl font-semibold mb-5 text-gray-700">
              Estado de ánimo
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(emotionLabels).map(([value, label]) => (
                <label
    key={value}
    className={`
      cursor-pointer flex items-center gap-3 text-gray-700 hover:text-blue-600 
      transition select-none rounded-lg p-2 border
      ${estadoAnimo === value ? emotionColors[value] : "border-transparent"}
    `}
  >
    <input
      type="radio"
      name="estado"
      value={value}
      checked={estadoAnimo === value}
      onChange={(e) => setEstadoAnimo(e.target.value)}
      className="form-radio h-5 w-5 text-blue-600"
    />
    <span className="text-base">{label}</span>
  </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="bg-gray-100 rounded-xl p-5 mb-6">
          <fieldset>
            <legend className="text-xl font-semibold mb-5 text-gray-700">
              Color que prefieres hoy
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(colorOptions).map(([value, label]) => {
                const isSelected = colorPreferido === value;
                return (
                  <label
                    key={value}
                    className={`
                      cursor-pointer flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 select-none
                      rounded-lg p-3 border-2
                      ${isSelected ? `${bgColors[value]} ${borderColors[value]}` : "border-transparent"}
                    `}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={value}
                      checked={isSelected}
                      onChange={(e) => setColorPreferido(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="text-base">{label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default EstadoAnimo;