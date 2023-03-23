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
import TagSelector from './components/inputs/tagSelector';

const val = [{ value: "1", label: "Amistoso", color: "#FFC107" }]

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
        <Route path='/profile' element={<> <PublicProfile/> <Chat /> </>}/>
        <Route path='/profile/:username' element={<> <PublicProfile/> <Chat /> </>}/>
        <Route path='/me' element={<AccountSettings/>}/>
        <Route path='/prueba' element={<TagSelector defaultValues={val}/>}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </Router>
  );
}

export default App;
