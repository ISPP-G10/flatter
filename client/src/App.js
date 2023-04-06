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
import Example from './pages/example';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PricingPage from './pages/pricingPage';

function App() {

  const initialOptions = {
    "client-id": `${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
    currency: "EUR",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <Routes>
          <Route exact path="/" element={
            <>
              {
                localStorage.getItem('user') && localStorage.getItem('token') && localStorage.getItem('roles') ?
                <>
                  <MainPage/>
                </>
                :
                  <LandingPage/>
              }
            </>
          }/>
          <Route path="/privacy" element={<> <PrivacyPage/> </>}/>
          <Route path="/search" element={<> <ListProperties/> </>}/>
          <Route path="/users" element={<> <SearchUsers/> </>}/>
          <Route path="/properties" element={<> <OwnerProperties /> </>}/>
          <Route path="/property/:id" element={<> <PropertyDetails /> </>}/>
          <Route path='/property/requests' element={<> <PropertyRequests/> </>}/>
          <Route path='/profile' element={<> <PublicProfile/> </>}/>
          <Route path='/profile/:username' element={<> <PublicProfile/> </>}/>
          <Route path='/me' element={<> <AccountSettings/> </>}/>
          <Route path='/favourites' element={<> <FavouritesProperties/> </>}/>
          <Route path='/pricing' element={<> <PricingPage /> </>} />
          <Route path='/ejemplo' element={<> <Example/> </>}/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
