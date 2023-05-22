import "../static/css/pages/settings.css";

import FlatterPage from "../sections/flatterPage";
import usersAPI from "../api/usersAPI";
import FlatterModal from "../components/flatterModal";
import AccountSettingsForm from "../components/userSettings/accountSettingsForm";

import { useEffect, useRef, useState } from "react";
import { accountInputs } from "../forms/accountForm";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import PasswordSettingForm from "../components/userSettings/passwordSettingForm";
import SolidButton from "../sections/solidButton";
import { useApolloClient } from "@apollo/client";
import BenefitsSetting from "../components/userSettings/benefitsSetting";

const AccountSettings = () => {
  const client = useApolloClient();

  let [setting, setSetting] = useState("account");
  let userToken = localStorage.getItem("token", "");

  const navigator = useNavigate();
  const correctModalRef = useRef(null);

  const { loading, data } = useQuery(usersAPI.getUserByUsernameSettings, {
    variables: {
      username: localStorage.getItem("user", ""),
      userToken: userToken,
    },
  });

  const eliminarModalRef = useRef(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [benefitsData, setBenefitsData] = useState(undefined);

  const user = localStorage.getItem("user", "");

  function handleModal() {
    eliminarModalRef.current.open();
    setError("");
  }

  function handleCloseModal() {
    eliminarModalRef.current.close();
  }

  function handleChange(e) {
    setUsername(e.target.value);
  }

  async function handleSubmit(e) {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault();
    // Verificar que el nombre de usuario ingresado sea igual al del usuario actual
    if (username === user) {
      // Intentar eliminar la cuenta del usuario
      try {
        setError("");

        // Borrar la cuenta
        await client.mutate({
          mutation: usersAPI.deleteUser,
          variables: {
            username: user,
            token: userToken,
          },
        });

        // Borrar todo el contenido del local storage
        localStorage.clear();

        // Redirigir a la página de inicio
        window.location.href = "/";
      } catch (error) {
        // Mostrar el mensaje de error
        setError(error.message);
      }
    } else {
      // Mostrar un mensaje de error si el nombre de usuario no coincide
      setError("El nombre de usuario no coincide con el de la cuenta.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("inappropiateLanguage");
    localStorage.removeItem("roles");
    localStorage.removeItem("contract_limit");
    localStorage.removeItem("contract_date");

    window.location.href = "/";
  }

  useEffect(() => {
    if(!loading) {
      console.log(data.getUserByUsername.referralprogram)
      setBenefitsData(data.getUserByUsername.referralprogram)
    }
    if (!loading && setting === "account") {
      //eslint-disable-next-line
      accountInputs.map((input) => {
        if (input.name === "role") {
          if (data.getUserByUsername[input.name + "s"].length > 1) {
            input.defaultValue = "Ambos";
          } else {
            let currentBackendRole =
              data.getUserByUsername[input.name + "s"][0].role;
            if (currentBackendRole === "OWNER") {
              input.defaultValue = "Propietario";
            } else {
              input.defaultValue = "Inquilino";
            }
          }
        } else if (input.name === "genre") {
          switch (data.getUserByUsername[input.name]) {
            case "H":
              input.defaultValue = "Hombre";
              break;
            case "M":
              input.defaultValue = "Mujer";
              break;
            case "NB":
              input.defaultValue = "No Binario";
              break;
            default:
              input.defaultValue = "Otro";
          }
        } else {
          input.defaultValue = data.getUserByUsername[input.name];
        }
    });
    }
  }, [data, loading, setting]);

  return (
    <FlatterPage withBackground userLogged withAds={false}>
      <div className="settings-page-container">
        <div className="settings-title">
          <h1>Configuración de la cuenta</h1>
        </div>
        <div className="settings-content">
          <div className="settings-sections">
            <h2 className="settings-sections-title">Opciones</h2>
            <div
              className="settings-section"
              onClick={() => setSetting("account")}
              style={
                setting === "account"
                  ? {
                      backgroundColor: "rgba(0, 168, 255, 0.8)",
                      color: "white",
                    }
                  : {}
              }
            >
              <h4>Mi cuenta</h4>
            </div>
            <div
              className="settings-section"
              onClick={() => setSetting("password")}
              style={
                setting === "password"
                  ? {
                      backgroundColor: "rgba(0, 168, 255, 0.8)",
                      color: "white",
                    }
                  : {}
              }
            >
              <h4>Cambiar mi contraseña</h4>
            </div>
            <div
              className="settings-section"
              onClick={() =>
                navigator(`/profile/${localStorage.getItem("user", "")}`)
              }
            >
              <h4>Mi perfil público</h4>
            </div>
            {localStorage.getItem("roles") &&
              localStorage.getItem("roles").includes("RENTER") && (
                <div
                  className="settings-section"
                  onClick={() => navigator("/favourites")}
                >
                  <h4>Mis pisos favoritos</h4>
                </div>
              )}
            {localStorage.getItem("roles") &&
              localStorage.getItem("roles").includes("OWNER") && (
                <div
                  className="settings-section"
                  onClick={() => navigator(`/properties`)}
                >
                  <h4>Mis inmuebles</h4>
                </div>
              )}
            {localStorage.getItem("roles") &&
              localStorage.getItem("roles").includes("RENTER") && (
                <div
                  className="settings-section"
                  onClick={() => navigator(`/requests`)}
                >
                  <h4>Mis notificaciones</h4>
                </div>
              )}
            {localStorage.getItem("roles") &&
              localStorage.getItem("roles").includes("OWNER") && (
                <div
                  className="settings-section"
                  onClick={() => navigator(`/property/requests`)}
                >
                  <h4>Mis solicitudes</h4>
                </div>
              )}
            <div
              className="settings-section"
              onClick={() => navigator("/historial")}
            >
              <h4>Historial de pagos</h4>
            </div>
            {benefitsData && !benefitsData.isDisabled && new Date() <= Date.parse(benefitsData.endDate) && (
                <div
                className="settings-section"
                onClick={() => setSetting("benefits")}
                style={
                  setting === "benefits"
                    ? {
                        backgroundColor: "rgba(0, 168, 255, 0.8)",
                        color: "white",
                      }
                    : {}
                }
              >
                <h4>Mis beneficios</h4>
              </div>
              )}
            <div className="settings-section" onClick={logout}>
              <h4>Cerrar sesión</h4>
            </div>
            <div className="remove-account-section" onClick={handleModal}>
              <h4>Eliminar cuenta</h4>
            </div>
          </div>
          <div className="setting-body">
            <div className="setting-form-container">
              {loading ? (
                <h1>Loading...</h1>
              ) : setting === "account" ? (
                <AccountSettingsForm
                  inputs={accountInputs}
                  data={data}
                  correctModalRef={correctModalRef}
                />
              ) : setting === "password" ? (
                <PasswordSettingForm correctModalRef={correctModalRef} />
              ) : setting === "benefits" ? benefitsData ? (
                <BenefitsSetting quantity={benefitsData.userQuantity} referralQuantity={benefitsData.userReferredQuantity} invitations={benefitsData.timesToBeUsed} code={benefitsData.code} endDate={benefitsData.endDate} />
              ) : <h1>Loading...</h1> 
              : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <FlatterModal ref={correctModalRef} maxHeight={200}>
        <span className="everithing-fine-text">
          ¡Datos actualizados correctamente!
        </span>
      </FlatterModal>
      <FlatterModal ref={eliminarModalRef} maxHeight={350}>
        <div className="delete-account-form">
          <form onSubmit={handleSubmit}>
            <h1>Eliminar cuenta</h1>
            <p>
              Esta acción es irreversible y borrará todos tus datos. Por favor,
              lee el acuerdo de usuario antes de continuar. Para confirmar la
              eliminación de tu cuenta, escribe tu nombre de usuario completo y
              correctamente.
            </p>
            <br />
            {/* Un campo de texto para ingresar el nombre de usuario */}
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleChange}
              placeholder={user}
              style={{fontSize: "14px"}}
              required
            />
            {/* Un mensaje de error si lo hay */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* Un botón para cancelar la acción */}
            <div className="modal-footer" style={{ marginTop: 15 }}>
              <SolidButton
                className="btn btn-secondary"
                text="Cancelar"
                onClick={handleCloseModal}
              />
              {/* Un botón para confirmar la acción */}
              <SolidButton
                type="featured"
                className="btn btn-primary"
                text="Confirmar"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </FlatterModal>
    </FlatterPage>
  );
};

export default AccountSettings;
