import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/pricingPage.css";
import PricingOption from "../components/pricingOption";
import SolidButton from "../sections/solidButton";
import customAlert from "../libs/functions/customAlert";
import customConfirm from "../libs/functions/customConfirm";
import { FaCheck, FaTimes } from "react-icons/fa";

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
      <div className="pricing-container">
        <h1>Planes y Precios</h1>
        <section className="pricing-options">
          <PricingOption color="red" selectedOption>
            <h2>Básico</h2>
            <div className="prices-group">
              <p>Gratis</p>
            </div>
            <ul>
              <li>5 visitas al perfil por día</li>
              <li>6 etiquetas</li>
              <li>
                <FaTimes color="red" /> Prioridad en alquiler
              </li>
              <li>
                <FaTimes color="red" /> Sin anuncios
              </li>
              <li>
                <FaTimes color="red" /> Chats
              </li>
              <li>
                <FaTimes color="red" /> Soporte premium
              </li>
              <li>
                <FaTimes color="red" /> Ver perfiles que opinaron
              </li>
            </ul>
          </PricingOption>
          <PricingOption color="purple" selectedOption daysLeft={3}>
            <div className="recommended-tag">
              <p>Recomendado</p>
            </div>
            <h2>Avanzado</h2>
            <div className="prices-group">
              <p>
                85{" "}
                <img
                  src={require("../static/files/icons/flattercoins-icon.png")}
                  alt="Logo Flatter Coins"
                />{" "}
                (3 días)
              </p>
              <p>
                150{" "}
                <img
                  src={require("../static/files/icons/flattercoins-icon.png")}
                  alt="Logo Flatter Coins"
                />{" "}
                (7 días)
              </p>
            </div>
            <ul>
              <li>15 visitas al perfil por día</li>
              <li>10 etiquetas</li>
              <li>
                <FaTimes color="red" /> Prioridad en alquiler
              </li>
              <li>
                <FaCheck color="green" /> Sin anuncios
              </li>
              <li>
                <FaCheck color="orange" /> Chats (5 máximo)
              </li>
              <li>
                <FaCheck color="green" /> Soporte premium
              </li>
              <li>
                <FaCheck color="green" /> Ver perfiles que opinaron
              </li>
            </ul>
            <div className="pricing-btn-group">
              <SolidButton
                type="featured"
                text="Comprar 3 días"
                onClick={() => handleConfirm(85)}
              />
              <SolidButton
                type="featured"
                text="Comprar 7 días"
                onClick={() => handleConfirm(150)}
              />
            </div>
          </PricingOption>
          <PricingOption color="orange">
            <h2>Pro</h2>
            <div className="prices-group">
              <p>
                190{" "}
                <img
                  src={require("../static/files/icons/flattercoins-icon.png")}
                  alt="Logo Flatter Coins"
                />{" "}
                (3 días)
              </p>
              <p>
                375{" "}
                <img
                  src={require("../static/files/icons/flattercoins-icon.png")}
                  alt="Logo Flatter Coins"
                />{" "}
                (7 días)
              </p>
            </div>
            <ul>
              <li>Visitas al perfil ilimitadas</li>
              <li>10 etiquetas</li>
              <li>
                <FaCheck color="green" /> Prioridad en alquiler
              </li>
              <li>
                <FaCheck color="green" /> Sin anuncios
              </li>
              <li>
                <FaCheck color="green" /> Chats ilimitados
              </li>
              <li>
                <FaCheck color="green" /> Soporte premium
              </li>
              <li>
                <FaCheck color="green" /> Ver perfiles que opinaron
              </li>
            </ul>
            <div className="pricing-btn-group">
              <SolidButton
                type="featured"
                text="Comprar 3 días"
                onClick={() => handleConfirm(190)}
              />
              <SolidButton
                type="featured"
                text="Comprar 7 días"
                onClick={() => handleConfirm(375)}
              />
            </div>
          </PricingOption>
        </section>
      </div>
    </FlatterPage>
  );
};

export default PricingPage;
