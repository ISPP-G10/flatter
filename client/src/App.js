import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Error from './pages/error';
import './static/css/globals.css';
import Ejemplo from './pages/ejemploIntegracion';
import Pruebas from './pages/pruebas';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route path="/prueba" element={<Ejemplo/>}/>
        <Route path="/prueba2" element={<Pruebas/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
