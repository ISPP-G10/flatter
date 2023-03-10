import './static/css/globals.css';
import "./static/css/legacyBootstrap.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Error from './pages/error';
import PropertyDetails from './pages/propertyDetails';
import MainPage from './pages/mainPage';
import OwnerProperties from './pages/ownerProperties';
import PublicProfile from './pages/publicProfile';
import ListProperties from './pages/listProperties';
import AccountSettings from './pages/accountSettings';
import PrivacyPage from './pages/privacyPage';
import SearchUsers from './pages/searchUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route exact path="/main" element={<MainPage/>}/>
        <Route path="/privacy" element={<PrivacyPage/>}/>
        <Route path="/properties" element={<OwnerProperties />}/>
        <Route path="/search" element={<ListProperties/>}/>
        <Route path="/users" element={<SearchUsers/>}/>
        <Route path="/property/:id" element={<PropertyDetails />}/>
        <Route path='/profile' element={<> <PublicProfile/> </>}/>
        <Route path='/profile/:username' element={<> <PublicProfile/> </>}/>
        <Route path='/me' element={<AccountSettings/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
