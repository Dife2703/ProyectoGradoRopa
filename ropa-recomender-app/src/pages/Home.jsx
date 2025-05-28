import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { categories } from "../utils/categories";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [view, setView] = useState("categorias"); // "categorias" o "favoritos"
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
    <div className="min-h-screen bg-purple-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-red-500">
          ¿Qué tipo de prenda buscas hoy?
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/estado-animo")}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Repetir Test
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Botones de vista con efecto sliding */}
      {/* Botones de vista con efecto sliding más suave y espaciado */}
      <div className="relative flex justify-center gap-0 mb-6 rounded-md" style={{ width: "fit-content", margin: "0 auto", top: 0 }}>
      {/* Slider rojo */}
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
          <h2 className="text-xl font-semibold mb-4 text-center"></h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-2 mb-8 w-full">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => handleCategorySelect(item.value)}
                className={`p-1 rounded-lg border-2 transition-transform duration-300 hover:scale-105 w-full ${
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
              className="-mt-7 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center"></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 w-full">
            {favoritos.length > 0 ? (
              favoritos.map((prenda) => (
                <div key={prenda.firestoreId} className="border rounded-lg p-2 relative">
                  <img
                    src={prenda.link}
                    alt={prenda.productDisplayName || "Prenda"}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <p className="text-sm mt-2 text-center font-semibold">
                    {prenda.productDisplayName}
                  </p>
                  <button
                    onClick={() => eliminarFavorito(prenda.firestoreId)}
                    className="absolute top-2 right-2 text-red-600 text-xl hover:text-red-800"
                    aria-label="Eliminar favorito"
                    title="Eliminar favorito"
                  >
                    🗑️
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