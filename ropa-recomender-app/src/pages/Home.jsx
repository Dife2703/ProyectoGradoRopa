import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { categories } from "../utils/categories";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [view, setView] = useState("categorias");
  const [favoritos, setFavoritos] = useState([]);

  const navigate = useNavigate();
  const userEmail = auth.currentUser?.email;

  const categoriasRef = useRef(null);
  const favoritosRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});

  useEffect(() => {
    const updateSlider = () => {
      const ref = view === "categorias" ? categoriasRef.current : favoritosRef.current;
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
  }, [view]);

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      navigate(`/seleccion-prendas/${selectedCategory}`);
    } else {
      alert("Por favor selecciona una categoría.");
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  const fetchFavoritos = async () => {
    if (!userEmail) return;
    try {
      const ref = collection(db, "usuarios", userEmail, "preferencias");
      const snapshot = await getDocs(ref);
      const prendas = snapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));
      setFavoritos(prendas);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    }
  };

  useEffect(() => {
    fetchFavoritos();
  }, [userEmail]);

  const eliminarFavorito = async (firestoreId) => {
    if (!userEmail) return;
    try {
      const favoritoDocRef = doc(db, "usuarios", userEmail, "preferencias", firestoreId);
      await deleteDoc(favoritoDocRef);
      fetchFavoritos();
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  return (
    <div className="pt-5 min-h-screen bg-gray-50 bg-amber-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-red-500">
          ¿Qué tipo de prenda buscas hoy?
        </h1>
      </div>

      {/* Botones de vista */}
      <div className="relative flex justify-center gap-0 mb-6 rounded-md" style={{ width: "fit-content", margin: "0 auto", top: -10 }}>
        <div
          className="absolute top-0.5 bottom-0.5 bg-red-500 rounded-md transition-all duration-300 ease-in-out"
          style={{
            left: sliderStyle.left ? `calc(${sliderStyle.left} + 4px)` : 0,
            width: sliderStyle.width ? `calc(${sliderStyle.width} - 8px)` : "0px",
            zIndex: 0,
          }}
        />
        <button
          ref={categoriasRef}
          style={{ width: "120px" }}
          className={`relative z-10 px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
            view === "categorias" ? "text-white" : "text-gray-700"
          }`}
          onClick={() => setView("categorias")}
        >
          Categorías
        </button>
        <button
          ref={favoritosRef}
          style={{ width: "120px" }}
          className={`relative z-10 px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
            view === "favoritos" ? "text-white" : "text-gray-700"
          }`}
          onClick={() => setView("favoritos")}
        >
          Favoritos
        </button>
      </div>

      {/* Contenido */}
      {view === "categorias" ? (
        <>
          <div className="pt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-[10px] mb-6 w-full">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => handleCategorySelect(item.value)}
                className={`p-1 rounded-lg border-2 transition-transform rounded-xl bg-white duration-300 hover:scale-105 w-full lg:gap-[2px] ${
                  selectedCategory === item.value ? "border-red-500" : "border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <p className="text-sm mt-1 text-center">{item.name}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="-mt-7 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="pt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-2 mb-8 w-full">
            {favoritos.length > 0 ? (
              favoritos.map((prenda) => (
                <div
                  key={prenda.firestoreId}
                  className="p-1 rounded-lg border-2 transition-transform bg-white duration-300 hover:scale-105 w-full border-transparent relative"
                >
                  <img
                    src={prenda.link}
                    alt={prenda.productDisplayName || "Prenda"}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <p className="text-sm mt-1 text-center">{prenda.productDisplayName}</p>

                  {/* BOTÓN DE ELIMINAR EN ESQUINA INFERIOR DERECHA DE LA TARJETA */}
                  <button
                    onClick={() => eliminarFavorito(prenda.firestoreId)}
                    className="absolute top-0 right-0 sm:top-1 sm:right-1 w-12 h-12 text-2xl flex items-center justify-center text-red-600 hover:text-red-800 z-10"
                    aria-label="Eliminar favorito"
                    title="Eliminar favorito"
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 transition-all duration-200"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      <path d="m12 13-1-1 2-2-3-3 2-2"/>
                    </svg>

                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No tienes prendas favoritas aún.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;