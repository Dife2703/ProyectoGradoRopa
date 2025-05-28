// src/pages/EstadoAnimo.jsx
import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const emotionLabels = {
  happy: "Feliz 😊",
  sad: "Triste 😢",
  angry: "Molesto 😡",
  surprised: "Sorprendido 😲",
  fearful: "Miedoso 😨",
  disgusted: "Disgustado 🤢",
  neutral: "Neutral 😐",
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
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
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

        // Ocultar popup después de 3 segundos
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!detectedEmotion) {
    alert("Primero debes detectar tu emoción.");
    return;
  }

  if (!estadoAnimo || !colorPreferido || !detectedEmotion) {
  alert("Por favor completa todas las selecciones y detecta tu emoción.");
  return;
  }

  try {
    const docRef = doc(db, "usuarios", usuario.email);
    await updateDoc(docRef, {
      estadoAnimo,
      colorPreferido,
      emocionDetectada: detectedEmotion, // <- aquí se guarda
    });
    console.log("Datos guardados en Firestore");
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    alert("Hubo un problema al guardar los datos.");
  }

  navigate("/"); // Redirige al Home u otra página
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 px-4 py-8 relative">
      {/* === Cámara y detección === */}
      <div className="mb-6 flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          className="w-64 h-64 rounded-lg shadow-lg bg-black mb-4"
        />

        <div className="flex gap-4">
          <button
            onClick={startCamera}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Activar Cámara
          </button>
          <button
            onClick={detectEmotion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Detectar Emoción
          </button>
        </div>

        {/* Popup de emoción */}
        {showPopup && detectedEmotion && (
          <div className="mt-4 bg-white border border-gray-300 px-4 py-2 rounded shadow text-center animate-fade-in-out">
            <p className="text-lg font-semibold">
              Según mi análisis, tu emoción es:{" "}
              <span className="text-blue-600">{emotionLabels[detectedEmotion]}</span>
            </p>
          </div>
        )}
      </div>

      {/* === Formulario === */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">¿Cómo te sientes hoy?</h2>

        <div className="mb-4">
          <label className="font-semibold">Estado de ánimo:</label>
          <div className="flex flex-col mt-2">
            {Object.entries(emotionLabels).map(([value, label]) => (
              <label key={value} className="inline-flex items-center mb-1">
                <input
                  type="radio"
                  name="estado"
                  value={value}
                  checked={estadoAnimo === value}
                  onChange={(e) => setEstadoAnimo(e.target.value)}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="font-semibold">Color que prefieres hoy:</label>
          <div className="flex flex-col mt-2">
            {Object.entries(colorOptions).map(([value, label]) => (
              <label key={value} className="inline-flex items-center mb-1">
                <input
                  type="radio"
                  name="color"
                  value={value}
                  checked={colorPreferido === value}
                  onChange={(e) => setColorPreferido(e.target.value)}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default EstadoAnimo;

