import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Shinder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const { recomendaciones = [], emotion = "neutral" } = location.state || {};

  const [indice, setIndice] = useState(0);
  const [likes, setLikes] = useState([]);

  const handleDecision = (gusto) => {
    const actual = recomendaciones[indice];
    if (!actual) return;

    if (gusto) {
      setLikes((prev) => [...prev, actual]);
    }

    setIndice((prev) => prev + 1);
  };

  const enviarLikesAlBackend = async () => {
    try {
      const payload = {
      emotion: emotion,  
      likes  // aquí tienes un error: usas "likedItems" que no está definido, debe ser "likes"
      };
      console.log("JSON que se va a enviar al backend:", JSON.stringify(payload, null, 2));
      const response = await fetch("http://localhost:8000/api/tinder-feedback-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emotion: emotion,  
          likes: likes
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Tus gustos fueron enviados exitosamente");
        console.log("✅ Respuesta del backend:", data);
        navigate("/"); // redirige a home u otra página al finalizar
      } else {
        console.error("❌ Error al enviar likes:", data);
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

  if (!recomendaciones.length) return <p>No hay recomendaciones para mostrar.</p>;
  if (indice >= recomendaciones.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>¡Has visto todas las recomendaciones!</h2>
        <button
          onClick={enviarLikesAlBackend}
          style={{ marginTop: "1rem", padding: "12px 24px", backgroundColor: "#4CAF50", color: "white", borderRadius: "6px" }}
        >
          Enviar prendas que me gustaron
        </button>
      </div>
    );
  }

  const actual = recomendaciones[indice];

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>¿Te gusta esta prenda?</h2>
      <img
        src={actual.link}
        alt={actual.productDisplayName}
        style={{ width: "250px", height: "auto", borderRadius: "8px" }}
      />
      <h3>{actual.productDisplayName}</h3>
      <p>Color: {actual.baseColour} | Categoría: {actual.category}</p>
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => handleDecision(true)}
          style={{ marginRight: "1rem", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white" }}
        >
          Me gusta 👍
        </button>
        <button
          onClick={() => handleDecision(false)}
          style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white" }}
        >
          No me gusta 👎
        </button>
      </div>
    </div>
  );
};

export default Shinder;