import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import UsuarioList from './components/UsuarioList.jsx';
import ProveedorList from './components/ProveedorList.jsx';
import CategoriaList from './components/CategoriaList.jsx';
import ProductoList from './components/ProductoList.jsx';
import { Login } from './components/Login.jsx';
import ExistenciaList from './components/ExistenciaList.jsx';
import ReporteEntrada from './components/EntradaReporte.jsx';
import ReporteSalida from './components/SalidaReporte.jsx';
import ExistenciaMinimaReporte from './components/ExistenciaMinimaReporte.jsx';
import DashboardSistema from './components/DashboardSistema.jsx';
function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<DashboardSistema />} />
            <Route path="/dashUser" element={<UsuarioList />} />
            <Route path="/dashCategoria" element={<CategoriaList />} />
            <Route path="/dashProducto" element={<ProductoList />} />
            <Route path="/dashProveedor" element={<ProveedorList />} />
            <Route path="/dashExistencia" element={<ExistenciaList />} />
            <Route path="/dashEntrada" element={<ReporteEntrada />} />
            <Route path="/dashSalida" element={<ReporteSalida />} />
            <Route path="/reporteMinExis" element={<ExistenciaMinimaReporte />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
