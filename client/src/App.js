import './static/css/globals.css';
import "./static/css/legacyBootstrap.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/landingPage';
import Error from './pages/error';
import Chat from './sections/chat';
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
              <>
                <MainPage/>
                <Chat/>
              </>
              :
              <LandingPage/>
            }
          </>
        }/>
        <Route path="/privacy" element={<> <PrivacyPage/> <Chat/> </>}/>
        <Route path="/search" element={<> <ListProperties/> <Chat/> </>}/>
        <Route path="/users" element={<> <SearchUsers/> <Chat/> </>}/>
        <Route path="/properties" element={<> <OwnerProperties /> <Chat/> </>}/>
        <Route path="/property/:id" element={<> <PropertyDetails /> <Chat/> </>}/>
        <Route path='/property/requests' element={<> <PropertyRequests/> <Chat/> </>}/>
        <Route path='/profile' element={<> <PublicProfile/> <Chat/> </>}/>
        <Route path='/profile/:username' element={<> <PublicProfile/> <Chat/> </>}/>
        <Route path='/me' element={<> <AccountSettings/> <Chat/> </>}/>
        <Route path='/favourites' element={<> <FavouritesProperties/> <Chat/> </>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
