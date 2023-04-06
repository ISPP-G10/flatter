import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/pricingPage.css";
import PricingOption from "../components/pricingOption";
import { useEffect, useState, useRef } from "react";
import SolidButton from "../sections/solidButton";
import customAlert from "../libs/functions/customAlert";
import FlatterModal from "../components/flatterModal";
import FlatterForm from "../components/forms/flatterForm";
import { registerInputs } from "../forms/registerForm";
import { useApolloClient } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import customConfirm from "../libs/functions/customConfirm";
import { IconContext } from "react-icons";
import { FaCheck, FaTimes, FaPaperPlane } from "react-icons/fa";
import { ImAirplane } from "react-icons/im";
import { BsFillRocketTakeoffFill, BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SuperAnimatedButton from "../components/superAnimatedButton/superAnimatedButton";

const PricingPage = () => {
  const navigator = useNavigate();

  const client = useApolloClient();

  const [user, setUser] = useState(null);

  const registerModalRef = useRef(null);
  const registerFormRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleRegisterButtonClick() {
    isMenuOpen && toggleMenu();
    registerModalRef.current.open();
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, []);

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
    <FlatterPage withBackground>
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
                <a href="#"> Activado </a>
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
                <a href="#"> Mejorar </a>
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
                <a href="#"> Mejorar </a>
              </div>
              {/* END Col three */}
          </div>
      </section>


      {/* <div className="pricing-container">
        <h1>Planes y Precios</h1>
        <section className="pricing-options">
          <PricingOption color="red" selectedOption>
            <h2>Básico</h2>
            <div className="plan-prices-group">
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
            {!user && (
              <SolidButton
                type="featured"
                text="Registrarse"
                onClick={handleRegisterButtonClick}
              />
            )}
          </PricingOption>
          <PricingOption color="purple" selectedOption daysLeft={3}>
            <div className="recommended-tag">
              <p>Recomendado</p>
            </div>
            <h2>Avanzado</h2>
            <div className="plan-prices-group">
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
            {user ? (
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
            ) : (
              <SolidButton type="featured" text="Registrarse" onClick={handleRegisterButtonClick} />
            )}
          </PricingOption>
          <PricingOption color="orange">
            <h2>Pro</h2>
            <div className="plan-prices-group">
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
            {user ? (
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
            ) : (
              <SolidButton type="featured" text="Registrarse" onClick={handleRegisterButtonClick} />
            )}
          </PricingOption>
        </section>
        <FlatterModal maxWidth={700} ref={registerModalRef}>
          <h1 className="auth-form-title">Regístrate</h1>
          <FlatterForm
            buttonText="Regístrate"
            showSuperAnimatedButton
            numberOfColumns={2}
            inputs={registerInputs}
            onSubmit={handleRegisterSubmit}
            ref={registerFormRef}
          />
        </FlatterModal>
      </div> */}
    </FlatterPage>
  );
};

export default PricingPage;
