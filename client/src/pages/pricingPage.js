import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/pricingPage.css";
import customAlert from "../libs/functions/customAlert";
import customConfirm from "../libs/functions/customConfirm";
import { FaCheck, FaTimes, FaPaperPlane } from "react-icons/fa";
import { ImAirplane } from "react-icons/im";
import { BsFillRocketTakeoffFill, BsDot } from "react-icons/bs";
import FlatterModal from "../components/flatterModal";
import { useRef, useState } from "react";
import SolidButton from "../sections/solidButton";

const PricingPage = () => {
  const [clickedPlanPrice, setClickedPlanPrice] = useState(0);
  const [planDays, setPlanDays] = useState(1);
  const [discount, setDiscount] = useState(0);

  const modalRef = useRef();

  function handleModal(price) {
    setClickedPlanPrice(price);
    setPlanDays(1);
    setDiscount(0);
    modalRef.current.open();
  }

  function handleOnChangeSelect(e) {
    const days = parseInt(e.target.value);
    if (days === 7) {
      // 10% discount with no decimals
      setDiscount(Math.floor(clickedPlanPrice * 0.1 * days));
    } else if (days > 7) {
      // 20% discount with no decimals
      setDiscount(Math.floor(clickedPlanPrice * 0.2 * days));
    } else {
      setDiscount(0);
    }
    setPlanDays(days);
  }

  function handleConfirm(price) {
    customConfirm(`Vas a pagar ${price} FlatterCoins, ¿quieres continuar?`)
      .then((response) => {
        customAlert("Has aceptado la confirmación");
        modalRef.current.close();
      })
      .catch((error) => {
        customAlert("Has cancelado la confirmación");
      });
  }

  return (
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Mis planes</h1>
      </div>
      <div className="section-pricing">
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
              <div
                className="d-flex"
                style={{ height: "60px", alignItems: "end" }}
              >
                <h5>/día</h5>
              </div>
            </div>
            <div className="option">
              <ul>
                <li>
                  <BsDot color="white" /> 10 visitas al perfil por día
                </li>
                <li>
                  <BsDot color="white" /> 6 etiquetas
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
              <div
                className="d-flex"
                style={{ height: "60px", alignItems: "end" }}
              >
                <h5>/día</h5>
              </div>
            </div>
            <div className="option">
              <ul>
                <li>
                  <BsDot color="white" /> 30 visitas al perfil por día
                </li>
                <li>
                  <BsDot color="white" /> 10 etiquetas
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
            <button onClick={() => handleModal(30)}> Mejorar </button>
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
              <div
                className="d-flex"
                style={{ height: "60px", alignItems: "end" }}
              >
                <h5>/día</h5>
              </div>
            </div>
            <div className="option">
              <ul>
                <li>
                  <BsDot color="white" /> Visitas al perfil ilimitadas
                </li>
                <li>
                  <BsDot color="white" /> 10 etiquetas
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
            <button onClick={() => handleModal(65)}> Mejorar </button>
          </div>
          {/* END Col three */}
        </div>
      </div>
      <FlatterModal ref={modalRef}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">¿Quieres mejorar tu plan?</h2>
          </div>
          <div className="modal-body">
            <ul>
              <li>Con 7 días tienes un 10% de descuento.</li>
              <li>Con más de 7 días tienes un 20% de descuento.</li>
            </ul>
            <br />
            <p>¿Durante cuánto tiempo quieres mejorar tu plan?</p>
            <select
              name="time-plan"
              id="time-plan"
              onChange={handleOnChangeSelect}
            >
              <option value="1">1 día</option>
              <option value="3">3 días</option>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="90">90 días</option>
              <option value="180">180 días</option>
            </select>
            <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {clickedPlanPrice}{" "}
              <img
                src={require("../static/files/icons/flattercoins-icon.png")}
                alt="Logo Flatter Coins"
                style={{ width: "20px" }}
              />{" "}
              x {planDays} días
              {discount > 0 && ` - ${discount}`}
              {discount > 0 && (
                <img
                  src={require("../static/files/icons/flattercoins-icon.png")}
                  alt="Logo Flatter Coins"
                  style={{ width: "20px" }}
                />
              )}{" "}
              = {clickedPlanPrice * planDays - discount}{" "}
              <img
                src={require("../static/files/icons/flattercoins-icon.png")}
                alt="Logo Flatter Coins"
                style={{ width: "20px" }}
              />
            </p>
          </div>
          <div className="modal-footer">
            <SolidButton
              className="btn btn-secondary"
              text="Cancelar"
              onClick={() => modalRef.current.close()}
            />
            <SolidButton
              type="featured"
              text="Continuar"
              className="btn btn-primary"
              onClick={() =>
                handleConfirm(clickedPlanPrice * planDays - discount)
              }
            />
          </div>
        </div>
      </FlatterModal>
    </FlatterPage>
  );
};

export default PricingPage;
