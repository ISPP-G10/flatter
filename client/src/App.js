import './static/css/globals.css';
import "./static/css/legacyBootstrap.css";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

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
import PersonalRequests from './pages/personalRequests';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PricingPage from './pages/pricingPage';
import ShopPage from './pages/shopPage';
import RecommendedUsers from './pages/recommendedUsers';
import HistorialPagosPage from './pages/historialPagosPage';

function App() {

  const initialOptions = {
    "client-id": `${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
    currency: "EUR",
  };
  
  const [activateChat, setActivateChat] = useState(false);

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
                  <Chat activateChat={activateChat} setActivateChat={setActivateChat} />
                </>
                :
                  <LandingPage/>
              }
            </>
          }/>
          <Route path="/privacy" element={<> <PrivacyPage/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path="/historial" element={<> <HistorialPagosPage /> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /> </>} />
          <Route path="/search" element={<> <ListProperties/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path="/users" element={<> <SearchUsers/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path="/properties" element={<> <OwnerProperties /> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path="/property/:id" element={<> <PropertyDetails setActivateChat={setActivateChat}/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path='/property/requests' element={<> <PropertyRequests/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path='/requests' element={<> <PersonalRequests/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path='/profile' element={<> <PublicProfile setActivateChat={setActivateChat} /> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /> </>}/>
          <Route path='/profile/:username' element={<> <PublicProfile setActivateChat={setActivateChat} /> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /> </>}/>
          <Route path='/me' element={<> <AccountSettings/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path='/favourites' element={<> <FavouritesProperties/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path='/pricing' element={<> <PricingPage /> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>} />
          <Route path='/shop' element={<> <ShopPage /> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>} />
          <Route path="/recommendations" element={<> <RecommendedUsers/> <Chat activateChat={activateChat} setActivateChat={setActivateChat} /></>}/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
