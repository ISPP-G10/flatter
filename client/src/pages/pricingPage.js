import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/pricingPage.css";
import customAlert from "../libs/functions/customAlert";
import customConfirm from "../libs/functions/customConfirm";
import { FaCheck, FaTimes, FaPaperPlane } from "react-icons/fa";
import { ImAirplane } from "react-icons/im";
import { BsFillRocketTakeoffFill, BsDot } from "react-icons/bs";

const PricingPage = () => {
  function handleConfirm(price) {
    customConfirm(`Vas a pagar ${price} FlatterCoins, ¿quieres continuar?`)
      .then((response) => {
        customAlert("Has aceptado la confirmación");
      })
      .catch((error) => {
        customAlert("Has rechazado la confirmación");
      });
  }

  return (
    <FlatterPage withBackground userLogged>
      <section>
          <div className="pricing-container">
              <div className="pricing-card text-center">
                <div className="title">
                  <div className="icon">
                    <FaPaperPlane color="white" />
                  </div>
                  <h2>Básico</h2>
                </div>
                <div className="plan-price">
                  <h4>0</h4>
                  <img
                    src={require("../static/files/icons/flattercoins-icon.png")}
                    alt="Logo Flatter Coins"
                  />
                  <div className="d-flex" style={{height: '60px', alignItems: 'end'}}>
                    <h5>/día</h5>
                  </div>
                </div>
                <div className="option">
                  <ul>
                    <li>
                      <BsDot color="white"/> 10 visitas al perfil por día
                    </li>
                    <li>
                      <BsDot color="white"/> 6 etiquetas
                    </li>
                    <li>
                      <FaTimes color="red" /> Sin anuncios
                    </li>
                    <li>
                      <FaTimes color="red" /> Crear chats
                    </li>
                    <li>
                      <FaTimes color="red" /> Soporte
                    </li>
                    <li>
                      <FaTimes color="red" /> Ver perfiles que opinaron
                    </li>
                  </ul>
                </div>
                <button disabled> Activado </button>
              </div>
              {/* END Col one */}
              <div className="pricing-card text-center">
                <div className="title">
                  <div className="icon">
                    <ImAirplane color="white" />
                  </div>
                  <h2>Avanzado</h2>
                </div>
                <div className="plan-price">
                  <h4>30</h4>
                  <img
                    src={require("../static/files/icons/flattercoins-icon.png")}
                    alt="Logo Flatter Coins"
                  />
                  <div className="d-flex" style={{height: '60px', alignItems: 'end'}}>
                    <h5>/día</h5>
                  </div>
                </div>
                <div className="option">
                <ul>
                  <li>
                    <BsDot color="white"/> 30 visitas al perfil por día
                  </li>
                  <li>
                    <BsDot color="white"/> 10 etiquetas
                  </li>
                  <li>
                    <FaCheck color="green" /> Sin anuncios
                  </li>
                  <li>
                    <FaCheck color="green" /> Crear chats
                  </li>
                  <li>
                    <FaCheck color="green" /> Soporte
                  </li>
                  <li>
                    <FaCheck color="green" /> Ver perfiles que opinaron
                  </li>
                </ul>
                </div>
                <button onClick={() => handleConfirm(30)}> Mejorar </button>
              </div>
              {/* END Col two */}
              <div className="pricing-card text-center">
                <div className="title">
                  <div className="icon">
                    <BsFillRocketTakeoffFill color="white" />
                  </div>
                  <h2>Pro</h2>
                </div>
                <div className="plan-price">
                  <h4>65</h4>
                  <img
                    src={require("../static/files/icons/flattercoins-icon.png")}
                    alt="Logo Flatter Coins"
                  />
                  <div className="d-flex" style={{height: '60px', alignItems: 'end'}}>
                    <h5>/día</h5>
                  </div>
                </div>
                <div className="option">
                <ul>
                  <li>
                    <BsDot color="white"/> Visitas al perfil ilimitadas
                  </li>
                  <li>
                    <BsDot color="white"/> 10 etiquetas
                  </li>
                  <li>
                    <FaCheck color="green" /> Sin anuncios
                  </li>
                  <li>
                    <FaCheck color="green" /> Crear chats
                  </li>
                  <li>
                    <FaCheck color="green" /> Soporte
                  </li>
                  <li>
                    <FaCheck color="green" /> Ver perfiles que opinaron
                  </li>
                </ul>
                </div>
                <button onClick={() => handleConfirm(65)}> Mejorar </button>
              </div>
              {/* END Col three */}
          </div>
      </section>
    </FlatterPage>
  );
};

export default PricingPage;
