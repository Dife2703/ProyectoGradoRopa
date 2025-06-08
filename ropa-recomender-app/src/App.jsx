import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import EstadoAnimo from "./pages/EstadoAnimo";
import Shinder from "./pages/Shinder";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./services/firebase";
import SeleccionPrendas from "./pages/SeleccionPrendas";
import Layout from "./components/Layout";

const RutaProtegidaConCheck = ({ children }) => {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(true);
  const [completo, setCompleto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDatos = async () => {
      const docRef = doc(db, "usuarios", usuario.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        if (!datos.estadoAnimo || !datos.emocionDetectada || !datos.colorPreferido) {
          navigate("/estado-animo");
        } else {
          setCompleto(true);
        }
      }
      setLoading(false);
    };

    if (usuario) checkDatos();
  }, [usuario]);

  if (loading) return <div>Cargando...</div>;

  return completo ? children : null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <RutaProtegidaConCheck>
                <Layout>
                <Home />
                </Layout>
              </RutaProtegidaConCheck>
            </PrivateRoute>
          }
        />
        <Route
          path="/estado-animo"
          element={
            <PrivateRoute>
              <Layout>
              <EstadoAnimo />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* ✅ Ruta nueva para seleccionar prendas */}
        <Route
          path="/seleccion-prendas/:categoria"
          element={
            <PrivateRoute>
              <Layout>
              <SeleccionPrendas />
              </Layout>
            </PrivateRoute>
          }
        />
        {/* ✅ Nueva ruta de Shinder */}
        <Route
          path="/shinder"
          element={
            <PrivateRoute>
              <Layout>
              <Shinder />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
