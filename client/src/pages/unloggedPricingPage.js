import { FaCheck, FaTimes, FaPaperPlane } from "react-icons/fa";
import { ImAirplane } from "react-icons/im";
import { BsFillRocketTakeoffFill, BsDot } from "react-icons/bs";
import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/pricingPage.css";
import { useQuery } from "@apollo/client";
import usersAPI from "../api/usersAPI";

const UnloggedPricingPage = () => {
  const { data, loading } = useQuery(usersAPI.getPlans);

  if (loading) return <p>Loading...</p>;

  return (
    <FlatterPage>
      <div style={{paddingTop: 70}}>
        <div>
          <h1 className="properties-title">Planes de suscripción</h1>
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
                <h4>{data.getPlans[0].flatterCoins}</h4>
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
                    <BsDot color="white" /> {data.getPlans[0].visitsNumber}{" "}
                    visitas al perfil por día
                  </li>
                  <li>
                    <BsDot color="white" /> {data.getPlans[0].tagsNumber}{" "}
                    etiquetas
                  </li>
                  <li>
                    {data.getPlans[0].advertisement ? (
                      <FaTimes color="red" />
                    ) : (
                      <FaCheck color="green" />
                    )}{" "}
                    Sin anuncios
                  </li>
                  <li>
                    {data.getPlans[0].chatCreation ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Crear chats
                  </li>
                  <li>
                    {data.getPlans[0].standardSupport ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Soporte estándar
                  </li>
                  <li>
                    {data.getPlans[0].premiumSupport ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Soporte premium
                  </li>
                  <li>
                    {data.getPlans[0].viewSelfProfileOpinions ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Ver perfiles que opinaron
                  </li>
                </ul>
              </div>
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
                <h4>{data.getPlans[1].flatterCoins}</h4>
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
                    <BsDot color="white" /> {data.getPlans[1].visitsNumber}{" "}
                    visitas al perfil por día
                  </li>
                  <li>
                    <BsDot color="white" /> {data.getPlans[1].tagsNumber}{" "}
                    etiquetas
                  </li>
                  <li>
                    {data.getPlans[1].advertisement ? (
                      <FaTimes color="red" />
                    ) : (
                      <FaCheck color="green" />
                    )}{" "}
                    Sin anuncios
                  </li>
                  <li>
                    {data.getPlans[1].chatCreation ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Crear chats
                  </li>
                  <li>
                    {data.getPlans[1].standardSupport ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Soporte estándar
                  </li>
                  <li>
                    {data.getPlans[1].premiumSupport ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Soporte premium
                  </li>
                  <li>
                    {data.getPlans[1].viewSelfProfileOpinions ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Ver perfiles que opinaron
                  </li>
                </ul>
              </div>
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
                <h4>{data.getPlans[2].flatterCoins}</h4>
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
                    <BsDot color="white" />
                    {data.getPlans[2].visitsNumber > 100000
                      ? "Visitas ilimitadas"
                      : data.getPlans[2].visitsNumber +
                        " visitas al perfil por día"}
                  </li>
                  <li>
                    <BsDot color="white" /> {data.getPlans[2].tagsNumber}{" "}
                    etiquetas
                  </li>
                  <li>
                    {data.getPlans[2].advertisement ? (
                      <FaTimes color="red" />
                    ) : (
                      <FaCheck color="green" />
                    )}{" "}
                    Sin anuncios
                  </li>
                  <li>
                    {data.getPlans[2].chatCreation ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Crear chats
                  </li>
                  <li>
                    {data.getPlans[2].standardSupport ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Soporte estándar
                  </li>
                  <li>
                    {data.getPlans[2].premiumSupport ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Soporte premium
                  </li>
                  <li>
                    {data.getPlans[2].viewSelfProfileOpinions ? (
                      <FaCheck color="green" />
                    ) : (
                      <FaTimes color="red" />
                    )}{" "}
                    Ver perfiles que opinaron
                  </li>
                </ul>
              </div>
            </div>
            {/* END Col three */}
          </div>
        </div>
      </div>
    </FlatterPage>
  );
};
export default UnloggedPricingPage;
