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
import FileUploadTest from './pages/fileUploadTest';
import Account from './pages/account';
import ChangePassword from './pages/changePassword';
import PrivacyPage from './pages/privacyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/main" element={<MainPage/>}/>
        <Route path="/privacy" element={<PrivacyPage/>}/>
        <Route path="/properties" element={<OwnerProperties />}/>
        <Route path="/searchProperties" element={<SearchProperties/>}/>
        <Route path="/property/:id" element={<PropertyDetails />}/>
        <Route path='/profile' element={<> <PublicProfile/> </>}/>
        <Route path='/test' element={ <FileUploadTest/> }/>
        <Route path='/profile/:username' element={<> <PublicProfile/> </>}/>
        <Route path='/me/account' element={<Account/>}/>
        <Route path='/me/changePassword' element={<ChangePassword/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
