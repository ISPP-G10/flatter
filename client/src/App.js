import "./static/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Error from './pages/error';
import './static/css/globals.css';
import Ejemplo from './pages/ejemploIntegracion';
import PublicProfile from './pages/publicProfile';
import Chat from './sections/chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<> <Chat /> <LandingPage/> </>}/>
        <Route path="/prueba" element={<Ejemplo/>}/>
        <Route path='/profile' element={<> <Chat /> <PublicProfile/> </>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
