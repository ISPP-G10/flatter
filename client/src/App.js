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
import PropertyRequests from './pages/propertyRequests';
import FavouritesProperties from './pages/favouritesProperties';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          <>
            {
              localStorage.getItem('user') && localStorage.getItem('token') ?
              <MainPage/>
              :
              <LandingPage/>
            }
          </>
        }/>
        <Route path="/privacy" element={<PrivacyPage/>}/>
        <Route path="/search" element={<ListProperties/>}/>
        <Route path="/users" element={<SearchUsers/>}/>
        <Route path="/properties" element={<OwnerProperties />}/>
        <Route path="/property/:id" element={<PropertyDetails />}/>
        <Route path='/property/requests' element={<> <PropertyRequests/> </>}/>
        <Route path='/profile' element={<> <PublicProfile/> </>}/>
        <Route path='/profile/:username' element={<> <PublicProfile/> </>}/>
        <Route path='/me' element={<AccountSettings/>}/>
        <Route path='/favourites' element={<FavouritesProperties/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
