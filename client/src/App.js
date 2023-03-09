import './static/css/globals.css';
import "./static/css/legacyBootstrap.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Error from './pages/error';
import PropertyDetails from './pages/propertyDetails';
import MainPage from './pages/mainPage';
import SearchProperties from './pages/searchProperties';
import OwnerProperties from './pages/ownerProperties';
import PublicProfile from './pages/publicProfile';
import Chat from './sections/chat';
import FileUploadTest from './pages/fileUploadTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/main-page" element={<MainPage/>}/>
        <Route path="/properties" element={<OwnerProperties />}/>
        <Route path="/searchProperties" element={<SearchProperties/>}/>
        <Route path="/property/:id" element={<PropertyDetails />}/>
        <Route path='/profile' element={<> <Chat /> <PublicProfile/> </>}/>
        <Route path='/test' element={ <FileUploadTest/> }/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
