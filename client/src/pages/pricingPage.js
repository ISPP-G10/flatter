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
import { useQuery, useApolloClient } from "@apollo/client";
import usersAPI from "../api/usersAPI";

const PricingPage = () => {
  const { data, loading } = useQuery(usersAPI.getPlans);

  const userPlanQuery = useQuery(usersAPI.getContractByUsername, {
    variables: {
      username: localStorage.getItem("user", ""),
    },
  });

  const userPlan = userPlanQuery.data?.getContractByUsername.plan.planType;
  const userPlanLoading = userPlanQuery.loading;

  const [clickedPlanPrice, setClickedPlanPrice] = useState(0);
  const [clickedPlan, setClickedPlan] = useState("");
  const [planDays, setPlanDays] = useState(1);
  const [discount, setDiscount] = useState(0);

  const modalRef = useRef();
  const client = useApolloClient();

  function handleModal(price, plan) {
    setClickedPlanPrice(price);
    setClickedPlan(plan);
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

  function handleCancel() {
    customConfirm("¿Estás seguro de que quieres cancelar tu suscripción?")
      .then((response) => {
        client
          .mutate({
            mutation: usersAPI.changeContract,
            variables: {
              username: localStorage.getItem("user", ""),
              planType: "B",
              token: localStorage.getItem("token", ""),
              numDaysSelected: 1,
            },
          })
          .then((response) => {
            userPlanQuery.refetch();
            modalRef.current.close();
            customAlert(`Has cancelado tu suscripción correctamente.`);
          })
          .catch((error) => {
            customAlert(error.message);
          });
      })
      .catch((error) => {
        customAlert("Has cancelado la confirmación");
      });
  }

  function handleConfirm(price, clickedPlan) {
    customConfirm(`Vas a pagar ${price} FlatterCoins, ¿quieres continuar?`)
      .then((response) => {
        client
          .mutate({
            mutation: usersAPI.changeContract,
            variables: {
              username: localStorage.getItem("user", ""),
              planType: clickedPlan,
              numDaysSelected: parseInt(planDays),
              token: localStorage.getItem("token", ""),
            },
          })
          .then((response) => {
            userPlanQuery.refetch();
            modalRef.current.close();
            customAlert(
              `Has cambiado de plan correctamente, tu plan caduca el día ${response.data.changeContract.contract.endDate}.`
            );
          })
          .catch((error) => {
            customAlert(error.message);
          });
      })
      .catch((error) => {
        customAlert("Has cancelado la confirmación");
      });
  }

  if (loading || userPlanLoading) return <p>Loading...</p>;

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
                    <FaTimes color="red" />
                  ) : (
                    <FaCheck color="green" />
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
            {userPlan === "B" ? (
              <button disabled> Activado </button>
            ) : (
              <button onClick={handleCancel}> Cancelar </button>
            )}
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
                    <FaTimes color="red" />
                  ) : (
                    <FaCheck color="green" />
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
            {userPlan === "A" ? (
              <button disabled> Activado </button>
            ) : (
              <button
                onClick={() =>
                  handleModal(
                    data.getPlans[1].flatterCoins,
                    data.getPlans[1].planType
                  )
                }
              >
                {" "}
                Activar{" "}
              </button>
            )}
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
                    <FaTimes color="red" />
                  ) : (
                    <FaCheck color="green" />
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
            {userPlan === "P" ? (
              <button disabled> Activado </button>
            ) : (
              <button
                onClick={() =>
                  handleModal(
                    data.getPlans[2].flatterCoins,
                    data.getPlans[2].planType
                  )
                }
              >
                {" "}
                Activar{" "}
              </button>
            )}
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
                handleConfirm(
                  clickedPlanPrice * planDays - discount,
                  clickedPlan
                )
              }
            />
          </div>
        </div>
      </FlatterModal>
    </FlatterPage>
  );
};

export default PricingPage;
