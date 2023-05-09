import { useQuery } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/historialPagos.css";
import { useApolloClient } from "@apollo/client";
import customConfirm from "../libs/functions/customConfirm";
import customAlert from "../libs/functions/customAlert";

const HistorialPagosPage = () => {
  const client = useApolloClient();

  const { data, loading, refetch } = useQuery(
    usersAPI.getAllContractsByUsername,
    {
      variables: {
        username: localStorage.getItem("user", ""),
        userToken: localStorage.getItem("token", ""),
      },
    }
  );

  function dateToString(date) {
    // DD/MM/YYYY
    return (
      date.substring(8, 10) +
      "/" +
      date.substring(5, 7) +
      "/" +
      date.substring(0, 4)
    );
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
            refetch();
            customAlert(
              `Has cancelado tu suscripción correctamente.`,
              "success",
              false
            );
          })
          .catch((error) => {
            customAlert(error.message, "error", false);
          });
      })
      .catch((error) => {
        customAlert("Has cancelado la confirmación", "info", false);
      });
  }

  if (loading) return <p>Loading...</p>;

  console.log(data.getAllContractsByUsername);

  return (
    <FlatterPage withBackground userLogged>
      <h1 className="properties-title" style={{ marginBottom: 20 }}>
        Historial de pagos
      </h1>
      <div
        className="content content-list"
        style={{ marginLeft: 200, marginRight: 200 }}
      >
        <div className="card contracts">
          {data.getAllContractsByUsername.map((contract) => {
            return (
              <div className="contract" key={contract.id}>
                <div className="contract-content">
                  {
                    contract.plan.planType === "A" && <h2 style={{color: "#708090"}}>Avanzado</h2>
                  }
                  {
                    contract.plan.planType === "P" && <h2 style={{color: "#B8860B"}}>Pro</h2>
                  }
                  {
                    contract.plan.planType === "B" && <h2 style={{color: "white", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}>Básico</h2>
                  }
                  <div className="contract-dates">
                    <span>
                      Fecha de inicio: {dateToString(contract.initialDate)}
                    </span>
                    {contract.endDate && !contract.obsolete ? (
                      <>
                        <span>
                          Próximo pago: {dateToString(contract.endDate)}
                        </span>
                        <div
                          className="contract-cancel-btn"
                          onClick={handleCancel}
                        >
                          Cancelar
                        </div>
                      </>
                    ) : contract.endDate ? (
                      <span>
                        Fecha de fin: {dateToString(contract.endDate)}
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FlatterPage>
  );
};

export default HistorialPagosPage;
