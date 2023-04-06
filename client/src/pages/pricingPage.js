import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/pricingPage.css";
import PricingOption from "../components/pricingOption";
import { useEffect, useState, useRef } from "react";
import SolidButton from "../sections/solidButton";
import PaymentModal from "../components/paymentModal";
import customAlert from "../libs/functions/customAlert";

const PricingPage = () => {
  const [user, setUser] = useState(null);
  const [price, setPrice] = useState(0);
  const paymentModal = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, []);

  function handlePayment(price) {
    setPrice(price);
    paymentModal.current.open();
  }

  function handleCorrectPayment() {
    customAlert("El pago se ha realizado correctamente");
  }

  function handleBadPayment() {
    customAlert("El pago no se ha realizado correctamente");
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
              <li>Sin prioridad en alquiler</li>
              <li>Con anuncios</li>
              <li>Sin chats</li>
              <li>Soporte estándar</li>
              <li>Sin ver perfiles que opinaron</li>
            </ul>
            {!user && <SolidButton type="featured" text="Registrarse" />}
          </PricingOption>
          <PricingOption color="purple">
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
              <li>Sin prioridad en alquiler</li>
              <li>Sin anuncios</li>
              <li>Con 5 chats simultáneos como máximo</li>
              <li>Soporte premium</li>
              <li>Ver perfiles que opinaron</li>
            </ul>
            {user ? (
              <div className="pricing-btn-group">
                <SolidButton type="featured" text="Comprar 3 días" onClick={() => handlePayment(85)} />
                <SolidButton type="featured" text="Comprar 7 días" onClick={() => handlePayment(150)} />
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
              <li>Con prioridad en alquiler</li>
              <li>Sin anuncios</li>
              <li>Con chats ilimitados</li>
              <li>Soporte premium</li>
              <li>Ver perfiles que opinaron</li>
            </ul>
            {user ? (
              <div className="pricing-btn-group">
                <SolidButton type="featured" text="Comprar 3 días" onClick={() => handlePayment(190)} />
                <SolidButton type="featured" text="Comprar 7 días" onClick={() => handlePayment(375)} />
              </div>
            ) : (
              <SolidButton type="featured" text="Registrarse" />
            )}
          </PricingOption>
        </section>
        <PaymentModal
          price={price}
          resolve={handleCorrectPayment}
          reject={handleBadPayment}
          ref={paymentModal}
        />
      </div>
    </FlatterPage>
  );
};

export default PricingPage;
