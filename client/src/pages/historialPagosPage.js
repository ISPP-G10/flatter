import { useQuery } from "@apollo/client";
import usersAPI from "../api/usersAPI";
import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/historialPagos.css";

const HistorialPagosPage = () => {
  const { data, loading } = useQuery(usersAPI.getAllContractsByUsername, {
    variables: {
      username: localStorage.getItem("user", ""),
      userToken: localStorage.getItem("token", ""),
    },
  });

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
              contract.plan.planType !== "B" && (
                <div className="contract" key={contract.id}>
                  <div className="contract-content">
                    <h2>
                      {contract.plan.planType === "A" ? "Avanzado" : "Pro"}
                    </h2>
                    <div className="contract-dates">
                      <span>Fecha de inicio: {contract.initialDate}</span>
                      <span>
                        {contract.endDate &&
                          "Fecha de fin: " + contract.endDate}
                      </span>
                      {!contract.obsolete && (
                        <div className="contract-cancel-btn">Cancelar</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </FlatterPage>
  );
};

export default HistorialPagosPage;
