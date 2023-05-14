import "../static/css/pages/landing.css";

import ZoomingImages from "../components/landingPage/imagesZoom";
import HeroHome from "../components/hero/heroHome";
import FlatterPage from "../sections/flatterPage";
import ToggleFeatures from "../components/landingPage/toggleFeatures";
import FlatterModal from "../components/flatterModal";
import ToggleLandingForm from "../components/landingPage/toggleLandingForm";
import SolidButton from "../sections/solidButton";

import { useRef, useState } from "react";

const LandingPage = () => {
  const imageSet = [
    require("../static/files/images/sample-1.jpg"),
    require("../static/files/images/sample-2.jpg"),
    require("../static/files/images/sample-7.jpg"),
    require("../static/files/images/sample-4.jpg"),
    require("../static/files/images/sample-5.jpg"),
    require("../static/files/images/sample-6.jpg"),
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function handleFirstModal() {
    isMenuOpen && toggleMenu();
    modalFirstRef.current.open();
  }

  function handleSecondModal() {
    isMenuOpen && toggleMenu();
    modalSecondRef.current.open();
  }

  function handleThirdModal() {
    isMenuOpen && toggleMenu();
    modalThirdRef.current.open();
  }

  const moreInfoText = "Más información";
  const modalFirstRef = useRef(null);
  const modalSecondRef = useRef(null);
  const modalThirdRef = useRef(null);

  const pilotUsersForm = useRef(null);

  return (
    <FlatterPage>
      <HeroHome pilotUsersModal={pilotUsersForm} />

      <section id="whatsFlatter">
        <div>
          <img
            src={require("../static/files/images/ubicaciones.jpeg")}
            alt="Encontrar piso ideal"
          />
        </div>
        <div>
          <h2>Encuentra tu hogar ideal...</h2>

          <p>
            Nuestra plataforma de alquiler de viviendas va mucho más allá de ser
            una simple herramienta de búsqueda: es una comunidad colaborativa
            donde inquilinos y propietarios pueden interactuar de manera
            significativa.{" "}
          </p>

          <p>
            Los inquilinos pueden compartir sus experiencias y valoraciones
            sobre sus arrendadores y compañeros, mientras que los propietarios
            reciben comentarios útiles para mejorar su gestión y ofrecer un
            mejor servicio.
          </p>

          <p>
            Creemos en la transparencia y la retroalimentación constructiva, y
            nos esforzamos por fomentar una cultura de colaboración y apoyo
            mutuo en nuestra plataforma. ¡Únete a nuestra comunidad y comienza a
            disfrutar de la experiencia de alquilar una vivienda de forma más
            inteligente!
          </p>
        </div>
      </section>

      <FlatterModal maxWidth={800} ref={modalFirstRef}>
        <div className="info-modal">
          <div className="info-modal-header">
            <h1>Busca donde necesites</h1>
          </div>
          <h3>
            ¿Cómo funciona el sistema de chat para contactar con los
            propietarios de los pisos?
          </h3>
          <p>
            Funciona igual que en una red social, de forma que, si usted está
            interesado en alguna vivienda en particular, podrá acceder a un chat
            general con otras personas también interesadas y el propietario para
            poder informarse acerca de las condiciones del mismo. Después el
            propietario podrá chatear con los inquilinos potenciales uno por
            uno.
          </p>
          <h3>
            ¿Cómo se determina el precio en monedas especiales del alquiler de
            un piso?
          </h3>
          <p>
            El pago se estipula con el propietario, nuestros servicios solo
            sirven de intermediario.
          </p>
          <h3>
            ¿Qué pasa si tengo un problema con el propietario del piso y
            necesito un reembolso?
          </h3>
          <p>
            El seguro por fraude también va dirigido a los propietarios, la
            empresa filial se pondrá en contacto con usted para que pueda poner
            la demanda.
          </p>
          <h3>
            ¿Cómo se realiza el proceso de revisión y calificación del
            propietario y del piso?
          </h3>
          <p>
            Todos los problemas de este estilo, los suplimos con un sistema de
            verificación previo.
          </p>
        </div>
      </FlatterModal>
      <FlatterModal maxWidth={800} ref={modalSecondRef}>
        <div className="info-modal">
          <div className="info-modal-header">
            <h1>Gana en confianza</h1>
          </div>
          <p>
            Para garantizar que los propietarios no tengan que preocuparse por
            los impagos de los inquilinos, en Flatter nos encargamos de
            gestionar un seguro contra morosos en colaboración con una empresa
            aseguradora. Todo el papeleo y costos asociados con el seguro son
            manejados por nosotros, lo que significa que el propietario solo
            tendrá que aceptar y pagar su parte correspondiente.
          </p>
          <p>
            Cabe mencionar que una parte del pago que el propietario realiza
            para el seguro irá destinado a los desarrolladores de Flatter,
            quienes están comprometidos en hacer de la aplicación una plataforma
            confiable y segura para todas las partes involucradas en el proceso
            de alquiler de propiedades. De esta manera, en Flatter trabajamos
            para proporcionar a los propietarios una solución integral para la
            gestión de sus propiedades y la tranquilidad que necesitan en el
            proceso de alquiler.
          </p>
        </div>
      </FlatterModal>
      <FlatterModal maxWidth={800} ref={modalThirdRef}>
        <div className="info-modal">
          <div className="info-modal-header">
            <h1>Construye tu reputación</h1>
          </div>
          <h3>
            ¿Cómo se realiza el proceso de registro de mi piso en la aplicación?
          </h3>
          <p>
            Es sencillo, debe seleccionar una serie de etiquetas, asociadas con
            características de su vivienda, así como poner una descripción
            detallada del mismo e imágenes si lo desea. Una vez metidos los
            datos del piso debe aceptar el documento que permite a Flatter tener
            acceso a datos relativos a la contratación por si hay algún problema
            y listo.
          </p>
          <h3>
            ¿Cómo puedo recibir el pago del alquiler en monedas especiales y
            cambiarlas por dinero real?
          </h3>
          <p>No es posible cambiar a dinero de nuevo los Flatter Coins.</p>
          <h3>
            ¿Cómo se determina el tipo de cambio de las monedas especiales con
            respecto a mi moneda local?
          </h3>
          <p>En principio nuestros servicios solo se encuentran en España.</p>
          <h3>
            ¿Cómo se realiza el proceso de revisión y calificación de los
            inquilinos y su comportamiento en el piso?
          </h3>
          <p>
            Mediante los perfiles de cada usuario, podrá tomar decisiones en
            base a su criterio, de forma que los comentarios acerca del
            inquilino que pretenda acceder a su vivienda, así como si está o no
            verificado, le ayudarán a tomar la decisión más coherente.
          </p>
          <p>
            Este sistema de puntuación será no solo con comentarios que dicho
            inquilino no podrá evitar, sino con ciertas etiquetas también
            asociadas al mismo.
          </p>
        </div>
      </FlatterModal>
      <section id="fastView">
        <div className="view">
          <div className="view-header">
            <div>
              <img
                src={require("../static/files/icons/ubicacion.png")}
                alt="Busca en la zona que quieras"
              />
            </div>

            <h3>Busca donde necesites</h3>
          </div>
          <div className="view-content">
            Encuentra el hogar perfecto en la zona favorita. ¡marca un punto de
            referencia que conozcas y nosotros haremos el resto!
          </div>
          <div className="view-footer">
            <SolidButton
              type="featured"
              text={moreInfoText}
              onClick={handleFirstModal}
            ></SolidButton>
          </div>
        </div>
        <div className="view">
          <div className="view-header">
            <div>
              <img
                src={require("../static/files/icons/manos.png")}
                alt="Gana en confianza"
              />
            </div>

            <h3>Gana en confianza</h3>
          </div>
          <div className="view-content">
            Velamos por tu tranquilidad. Todos los trámites se realizan a través
            de nuestra plataforma para garantizar la máxima seguridad.
          </div>
          <div className="view-footer">
            <SolidButton
              type="featured"
              text={moreInfoText}
              onClick={handleSecondModal}
            ></SolidButton>
          </div>
        </div>
        <div className="view">
          <div className="view-header">
            <div>
              <img
                src={require("../static/files/icons/pulgares-hacia-arriba.png")}
                alt="Construye tu reputación"
              />
            </div>

            <h3>Construye tu reputación</h3>
          </div>
          <div className="view-content">
            ¡No te olvides de valorar al propietario y a tus compañeros! Tu
            opinión es muy importante para nosotros y para otros inquilinos.
          </div>
          <div className="view-footer">
            <SolidButton
              type="featured"
              text={moreInfoText}
              onClick={handleThirdModal}
            ></SolidButton>
          </div>
        </div>
      </section>

      <section id="features">
        <ToggleFeatures />
      </section>

      <section id="zoom">
        <h1>La búsqueda de piso que supera cualquier límite</h1>
        <ZoomingImages imageSet={imageSet} marginTop={300} />
      </section>

      <FlatterModal ref={pilotUsersForm}>
        <ToggleLandingForm>
          <>
            <div id="mc_embed_signup">
              <form
                action="https://seafony.us18.list-manage.com/subscribe/post?u=a6fea00d426951e0520437e5d&id=67cc14792f&f_id=005328e7f0"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
                noValidate
              >
                <div id="mc_embed_signup_scroll">
                  <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                    Regístrate como <b>Propietario</b>
                  </h2>
                  <div className="indicates-required">
                    <span className="asterisk">*</span> indica requerido
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-EMAIL">
                      Correo electrónico <span className="asterisk">*</span>
                    </label>
                    <input
                      type="email"
                      name="EMAIL"
                      className="required email"
                      id="mce-EMAIL"
                      required
                    />
                    <span id="mce-EMAIL-HELPERTEXT" className="helper_text" />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-FNAME">Nombre completo </label>
                    <input type="text" name="FNAME" id="mce-FNAME" />
                    <span id="mce-FNAME-HELPERTEXT" className="helper_text" />
                  </div>
                  <div id="mce-responses" className="clear foot">
                    <div
                      className="response"
                      id="mce-error-response"
                      style={{ display: "none" }}
                    />
                    <div
                      className="response"
                      id="mce-success-response"
                      style={{ display: "none" }}
                    />
                  </div>{" "}
                  {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                  <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_a6fea00d426951e0520437e5d_67cc14792f"
                      tabIndex={-1}
                      defaultValue
                    />
                  </div>
                  <div className="optionalParent" style={{ marginTop: "10px" }}>
                    <div
                      className="clear foot"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <input
                        type="submit"
                        className="button featured"
                        name="subscribe"
                        id="mc-embedded-subscribe"
                        value="Registrarme"
                      />
                    </div>
                  </div>
                </div>
                <input type="hidden" name="tags" value="2394668"></input>
              </form>
            </div>

            <div id="mc_embed_signup">
              <form
                action="https://seafony.us18.list-manage.com/subscribe/post?u=a6fea00d426951e0520437e5d&amp;id=67cc14792f&amp;f_id=005328e7f0"
                method="post"
                id="mc-embedded-subscribe-form-2"
                name="mc-embedded-subscribe-form-2"
                className="validate"
                target="_blank"
                noValidate
              >
                <div id="mc_embed_signup_scroll">
                  <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                    Regístrate como <b>Inquilino</b>
                  </h2>
                  <div className="indicates-required">
                    <span className="asterisk">*</span> indica requerido
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-EMAIL-2">
                      Correo electrónico <span className="asterisk">*</span>
                    </label>
                    <input
                      type="email"
                      name="EMAIL"
                      className="required email"
                      id="mce-EMAIL-2"
                      required
                    />
                    <span id="mce-EMAIL-HELPERTEXT-2" className="helper_text" />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-FNAME-2">Nombre completo </label>
                    <input type="text" name="FNAME" id="mce-FNAME-2" />
                    <span id="mce-FNAME-HELPERTEXT-2" className="helper_text" />
                  </div>
                  <div id="mce-responses-2" className="clear foot">
                    <div
                      className="response"
                      id="mce-error-response-2"
                      style={{ display: "none" }}
                    />
                    <div
                      className="response"
                      id="mce-success-response-2"
                      style={{ display: "none" }}
                    />
                  </div>{" "}
                  {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                  <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_a6fea00d426951e0520437e5d_67cc14792f"
                      tabIndex={-1}
                      defaultValue
                    />
                  </div>
                  <div className="optionalParent" style={{ marginTop: "10px" }}>
                    <div
                      className="clear foot"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <input
                        type="submit"
                        className="button featured"
                        name="subscribe"
                        id="mc-embedded-subscribe-2"
                        value="Registrarme"
                      />
                    </div>
                  </div>
                </div>
                <input type="hidden" name="tags" value="2394664"></input>
              </form>
            </div>
          </>
        </ToggleLandingForm>
      </FlatterModal>
    </FlatterPage>
  );
};

export default LandingPage;
