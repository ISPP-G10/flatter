import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Error from './pages/error';
import './static/css/globals.css';
import PropertyPage from './pages/propertyPage';
import Ejemplo from './pages/ejemploIntegracion';
import SearchProperties from './pages/searchProperties';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route path="/property/:id" element={<PropertyPage />}/>
        <Route path="/prueba" element={<Ejemplo/>}/>
        <Route path="*" element={<Error/>}/>
        <Route path="/searchProperties" element={<SearchProperties/>}/>
      </Routes>
    </Router>
  );
}

export default App;
