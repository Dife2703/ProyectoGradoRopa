import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { query, where, getDocs, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SeleccionPrendas = () => {
  const { categoria } = useParams();
  const [prendas, setPrendas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [genero, setGenero] = useState("");
  const [emocion, setEmocion] = useState("");
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const masculinoRef = useRef(null);
  const femeninoRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});

  const normalizarCategoria = (valor) => {
    if (valor === "falda-vestido") return "falda/vestido";
    return valor;
  };

  useEffect(() => {
    const obtenerEmocion = async () => {
      try {
        if (!usuario?.email) return;

        const docRef = doc(db, "usuarios", usuario.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datos = docSnap.data();
          const emocionDetectada = datos.emocionDetectada || "neutral";
          setEmocion(emocionDetectada.toLowerCase());
        } else {
          console.warn("No se encontró el documento del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener emoción de Firestore:", error);
      }
    };

    obtenerEmocion();
  }, [usuario]);

  useEffect(() => {
    if (!genero || !emocion) return;
    const url = `http://localhost:8000/api/recommendations/${emocion}?categoria=${normalizarCategoria(categoria)}&gender=${genero}`;

    fetch(url)
      .then((res) => res.json())
      .then((recomendaciones) => {
        const mezcladas = shuffleArray(recomendaciones);
        setPrendas(mezcladas);
      })
      .catch((error) => {
        console.error("Error al cargar recomendaciones:", error);
      });
  }, [categoria, genero, emocion]);

  useEffect(() => {
    const updateSlider = () => {
      const ref = genero === "men" ? masculinoRef.current : femeninoRef.current;
      if (ref) {
        setSliderStyle({
          width: ref.offsetWidth + "px",
          left: ref.offsetLeft + "px",
        });
      }
    };
    updateSlider();
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [genero]);

  const toggleSeleccion = (prenda) => {
    const yaSeleccionada = seleccionadas.find((p) => p.id === prenda.id);
    if (yaSeleccionada) {
      setSeleccionadas(seleccionadas.filter((p) => p.id !== prenda.id));
    } else {
      setSeleccionadas([...seleccionadas, prenda]);
    }
  };

  const guardarPreferencias = async () => {
    try {
      const ref = collection(db, "usuarios", usuario.email, "preferencias");
      for (const prenda of seleccionadas) {
      const prendaRef = doc(ref, prenda.id); // usa el ID de la prenda como clave
      const docSnap = await getDoc(prendaRef);

      if (!docSnap.exists()) {
        await setDoc(prendaRef, prenda); // solo guarda si no existe
        console.log(`✅ Guardada prenda: ${prenda.productDisplayName}`);
      } else {
        console.log(`⏭️ Prenda ya existente: ${prenda.productDisplayName}`);
      }
    }

      const response = await fetch("http://localhost:8000/api/tinder-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emotion: emocion,
          gender: genero,
          category: categoria,
        }),
      });

      const data = await response.json();
      if (response.ok && data.recommendations) {
        //alert("Preferencias guardadas localmente y enviadas al backend");
        navigate("/shinder", {
          state: {
            recomendaciones: data.recommendations,
            emotion: emocion,
          },
        });
      } else {
        console.error("Error del backend:", data);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar preferencias");
    }
  };

  return (
    <div className="pt-0 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-red-500">
        Selecciona las prendas que más te gusten
      </h1>

      <div className="mb-6 text-center">
        <p className="mb-4 font-semibold text-xl text-gray-800">
          Elige una colección para explorar
        </p>
        <div
        className="relative flex justify-center gap-0 mb-6 rounded-md"
        style={{ width: "fit-content", margin: "0 auto" }}
      >
        <div
          className={`absolute top-0.5 bottom-0.5 rounded-md transition-all duration-300 ease-in-out ${
            genero === "men"
              ? "bg-blue-500"
              : genero === "women"
              ? "bg-pink-500"
              : "bg-gray-300"
          }`}
          style={{
            left: genero
              ? sliderStyle.left
                ? `calc(${sliderStyle.left} + 4px)`
                : 0
              : masculinoRef.current && femeninoRef.current
              ? `${masculinoRef.current.offsetLeft}px`
              : 0,
            width: genero
              ? sliderStyle.width
                ? `calc(${sliderStyle.width} - 8px)`
                : "0px"
              : masculinoRef.current && femeninoRef.current
              ? `${femeninoRef.current.offsetLeft + femeninoRef.current.offsetWidth - masculinoRef.current.offsetLeft}px`
              : "0px",
            zIndex: 0,
          }}
        />
        <button
          ref={masculinoRef}
          style={{ width: "130px" }}
          className={`relative z-10 px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
            genero === "men" ? "text-white" : "text-gray-700"
          }`}
          onClick={() => setGenero("men")}
        >
          Masculino
        </button>
        <button
          ref={femeninoRef}
          style={{ width: "130px" }}
          className={`relative z-10 px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
            genero === "women" ? "text-white" : "text-gray-700"
          }`}
          onClick={() => setGenero("women")}
        >
          Femenino
        </button>
      </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {prendas.map((prenda) => (
          <div
            key={prenda.id}
            className={`p-1 rounded-lg border-2 bg-white cursor-pointer transition-transform duration-300 hover:scale-105 ${
              seleccionadas.find((p) => p.id === prenda.id)
                ? "border-red-500 shadow-md"
                : "border-gray-200"
            }`}
            onClick={() => toggleSeleccion(prenda)}
          >
            <img
              src={prenda.link}
              alt={prenda.productDisplayName}
              className="w-full aspect-square object-cover rounded-md"
            />
            <p className="text-sm mt-1 text-center font-medium">
              {prenda.productDisplayName}
            </p>
          </div>
        ))}
      </div>

      {seleccionadas.length > 0 && (
        <button
          onClick={guardarPreferencias}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg block mx-auto"
        >
          Guardar Preferencias
        </button>
      )}
    </div>
  );
};

export default SeleccionPrendas;