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
import { FaCheck, FaTimes } from "react-icons/fa";

const PricingPage = () => {
  const client = useApolloClient();

  const [user, setUser] = useState(null);

  const registerModalRef = useRef(null);
  const registerFormRef = useRef(null);

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

  function handleRegisterSubmit({ values }) {
    if (!registerFormRef.current.validate()) return;

    client
      .mutate({
        mutation: usersAPI.createUser,
        variables: {
          firstName: values.first_name,
          lastName: values.last_name,
          username: values.username,
          password: values.password,
          email: values.email,
          genre: values.genre,
          roles: values.role,
        },
      })
      .then((response) => {
        let token = response.data.tokenAuth.token;
        let username = response.data.tokenAuth.user.username;
        let roles = response.data.tokenAuth.user.roles.map((role) => role.role);

        localStorage.setItem("token", token);
        localStorage.setItem("user", username);
        localStorage.setItem("roles", roles);

        navigator(0);
      })
      .catch((error) => {
        customAlert(error.message.split("\n")[0]);
      });
  }

  return (
    <FlatterPage withBackground>
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
            {!user && <SolidButton type="featured" text="Registrarse" />}
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
              <SolidButton type="featured" text="Registrarse" />
            )}
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
              <SolidButton type="featured" text="Registrarse" />
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
      </div>
    </FlatterPage>
  );
};

export default PricingPage;
