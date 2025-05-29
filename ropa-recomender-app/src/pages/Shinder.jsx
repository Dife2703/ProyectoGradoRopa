import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/shinder/shinder.css";

const Shinder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const { recomendaciones = [], emotion = "neutral" } = location.state || {};
  const [indice, setIndice] = useState(0);
  const [likes, setLikes] = useState([]);
  const [animacion, setAnimacion] = useState("");
  const [indicador, setIndicador] = useState(null);

  const cardRef = useRef(null);
  const startX = useRef(null);

  useEffect(() => {
    if (indice + 1 < recomendaciones.length) {
      const nextImage = new Image();
      nextImage.src = recomendaciones[indice + 1].link;
    }
  }, [indice, recomendaciones]);

  const handleDecision = (gusto) => {
    const anim = gusto ? "swipe-right" : "swipe-left";
    const icon = gusto ? "❤️" : "❌";

    setAnimacion(anim);
    setIndicador(icon);

    setTimeout(() => {
      if (gusto) setLikes((prev) => [...prev, recomendaciones[indice]]);
      setIndice((prev) => prev + 1);
      setAnimacion("");
      setIndicador(null);
    }, 850); // más duración para que se vea la animación
  };

  const enviarLikesAlBackend = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/tinder-feedback-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, likes }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Tus gustos fueron enviados exitosamente");
        navigate("/");
      } else {
        console.error("❌ Error al enviar likes:", data);
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    const endX = e.clientX;
    const deltaX = endX - startX.current;

    if (Math.abs(deltaX) > 80) {
      if (deltaX > 0) {
        handleDecision(true); // derecha
      } else {
        handleDecision(false); // izquierda
      }
    }
  };

  const guardarPreferencias = async () => {
    try {
      if (!usuario?.email) {
        alert("Usuario no autenticado");
        return;
      }

      const ref = collection(db, "usuarios", usuario.email, "preferencias");

      for (const prenda of likes) {
        const prendaRef = doc(ref, prenda.id);
        const docSnap = await getDoc(prendaRef);

        if (!docSnap.exists()) {
          await setDoc(prendaRef, prenda);
          console.log(`Prenda ${prenda.productDisplayName} guardada.`);
        } else {
          console.log(`Prenda ${prenda.productDisplayName} ya existe.`);
        }
      }

      // Enviar al backend
      const response = await fetch("http://localhost:8000/api/tinder-feedback-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, likes }),
      });

      const data = await response.json();
      if (response.ok) {
        //alert("Tus gustos fueron enviados exitosamente");
        navigate("/");
      } else {
        console.error("❌ Error al enviar likes:", data);
      }
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
      alert("Error al guardar preferencias");
    }
  };

  if (!recomendaciones.length) return <p>No hay recomendaciones para mostrar.</p>;

  if (indice >= recomendaciones.length) {
    const total = recomendaciones.length;
    const gustadas = likes.length;
    const porcentaje = gustadas / total;

    let emoji = "😐";
    if (porcentaje >= 0.8) emoji = "😍";
    else if (porcentaje >= 0.6) emoji = "😊";
    else if (porcentaje >= 0.4) emoji = "🙂";
    else if (porcentaje >= 0.2) emoji = "😕";
    else emoji = "😢";

    return (
      <div className="shinder-end">
        <h2>¡Has visto todas las recomendaciones!</h2>
        <p className="resultado-final">
          {emoji} Te gustaron {gustadas} de {total} prendas.
        </p>
        <button onClick={guardarPreferencias} className="boton-enviar">
          Enviar prendas que me gustaron
        </button>
      </div>
    );
  }

  const actual = recomendaciones[indice];

  return (
    <div className="shinder-container">
      <h2>¿Te gusta esta prenda?</h2>

      <div
        ref={cardRef}
        className={`shinder-card ${animacion}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {indicador && (
          <div className={indicador === "❤️" ? "like" : "dislike"}>
            {indicador}
          </div>
        )}
        <img src={actual.link} alt={actual.productDisplayName} />
        <h3>{actual.productDisplayName}</h3>
        <p>Color: {actual.baseColour} | Categoría: {actual.category}</p>
      </div>

      <div className="shinder-buttons">
        <button className="btn-dislike" onClick={() => handleDecision(false)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button className="btn-like" onClick={() => handleDecision(true)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
              4.5 2.09C13.09 3.81 14.76 3 16.5 3 
              19.58 3 22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Shinder;