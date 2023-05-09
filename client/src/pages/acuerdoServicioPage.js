import FlatterPage from "../sections/flatterPage";
import "../static/css/pages/privacyPage.css";

const AcuerdoServicioPage = () => {
  return (
    <FlatterPage docPage>
      <div className="privacy-container">
        <h1>Acuerdo a nivel de Servicio</h1>
        <h3>Tipos de soporte</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Soporte estándar</th>
              <th>Soporte premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Horario</td>
              <td>9:00am a 12:00pm (Lunes a Viernes)</td>
              <td>9:00am a 05:00pm (Lunes a Viernes)</td>
            </tr>
            <tr>
              <td>Gestión de incidencias</td>
              <td>No</td>
              <td>Sí</td>
            </tr>
          </tbody>
        </table>
        <h3>Compensaciones</h3>
        <p>
          En caso de incumplimiento de alguna de las características de la tabla
          de SLA, el cliente podrá reclamar una compensación en Flatter Coins
          por valor de cada día que se ha incumplido las condiciones además de
          dos días de regalo añadidos. Es decir, si el cliente perjudicado tiene
          un plan Avanzado y se ve perjudicado durante dos días, recibirá 43
          Flatter Coins además de otros 43 Flatter Coins de regalo.
        </p>
        <p>
          No obstante, no tendrán validez estas compensaciones cuando se vea
          perjudicado por responsabilidades de terceros:
        </p>
        <ul>
          <li>
            Un mal uso por parte de los propietarios u otros usuarios que
            perjudiquen la experiencia del usuario.
          </li>
          <li>Causas de fuerza mayor. (Pandemias, incendios, etc)</li>
        </ul>
        <h3>Cambio de plan</h3>
        <p>
          Los inquilinos podrán cambiar su plan de servicio en cualquier
          momento. El cambio se efectuará una vez finalice el periodo de su plan
          actual.
        </p>
        <h3>Identificación</h3>
        <p>
          Cada contrato tendrá un número de versión diferente que será generado
          de forma aleatoria. Se utilizará este número para la identificación
          del contrato. Todos los números de identificación seguirán el
          siguiente patrón: X-00000-XXX siendo X cualquier letra del abecedario
          español (a excepción de la Ñ) y 0 cualquier número entero contenido
          entre 0 y 9 (ambos inclusive).
        </p>
      </div>
    </FlatterPage>
  );
};

export default AcuerdoServicioPage;
