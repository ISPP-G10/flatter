import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Error from './pages/error';
import './static/css/globals.css';
import PropertyPage from './pages/propertyPage';
import Ejemplo from './pages/ejemploIntegracion';
import SearchProperties from './pages/searchProperties';
import OwnerProperties from './pages/ownerProperties';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route path="/property/:id" element={<PropertyPage />}/>
        <Route path="/prueba" element={<Ejemplo/>}/>
        <Route path="*" element={<Error/>}/>
        <Route path="/searchProperties" element={<SearchProperties/>}/>
        <Route path="/properties" element={<OwnerProperties />}/>
      </Routes>
    </Router>
  );
}

export default App;
