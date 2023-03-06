import './static/css/globals.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Error from './pages/error';
import Ejemplo from './pages/ejemploIntegracion';
import DetalleVivienda from './pages/detalleVivienda';
import MainPage from './pages/mainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/main-page" element={<MainPage/>}/>
        <Route path="/prueba" element={<Ejemplo/>}/>
        <Route path="/vivienda" element={<DetalleVivienda/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
