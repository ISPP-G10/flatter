import '../static/css/pages/listProperties.css'
import '../static/css/pages/propertyRequests.css'

import FlatterPage from "../sections/flatterPage";
import personalRequestsAPI from '../api/personalRequestsAPI';
import * as settings from "../settings";
import customAlert from "../libs/functions/customAlert";
import { useQuery } from '@apollo/client';
import SolidButton from '../sections/solidButton';
import FlatterForm from '../components/forms/flatterForm';
import { filterRequestsInputs } from '../forms/filterRequestsForm';
import {useApolloClient} from '@apollo/client';
import { useNavigate } from "react-router-dom";
import useURLQuery from "../hooks/useURLQuery";
import { useState, useEffect, useRef } from "react";

const PersonalRequests = () => {

    const navigate = useNavigate();
    const client = useApolloClient();
    const query = useURLQuery();
    const filterFormRef = useRef(null);

    let [filterValues, setFilterValues] = useState({
        username : localStorage.getItem('user',''),
        status: query.get("status"),
        startdate: query.get("startdate" ?? ''),
        enddate: query.get("enddate" ?? ''),
      });
    
    let [requests, setRequests] = useState([]);

    //Actualmente tiene 7 dias de deadline, pero puede cambiarse si fuese preciso.
    function paymentDeadline(dateString) {
        const date = new Date(dateString);
        console.log("este es el date"+date)
        date.setDate(date.getDate() + 7);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }

    function handleRequestFilter({values}){

        if(!filterFormRef.current.validate()) return;

        let newStatus;
        switch(values.status) {
            case 'Pendientes':
                newStatus = 'P';
                break;
            case 'Aceptadas':
                newStatus = 'A';
                break;
            case 'Rechazadas':
                newStatus = 'D';
                break;
            case 'Todas':
                newStatus = '';
                break;
            default:
                newStatus = values.status;
    }

    setFilterValues({
        username: localStorage.getItem('user',''),
        status: newStatus,
        startdate: values.startdate,
        enddate: values.enddate
    })
    }
    
    useEffect(() => {

        client.query({
          query: personalRequestsAPI.getPersonalPetitions,
          variables: {
            username: filterValues.username,
            status: filterValues.status,
            startDate: filterValues.startdate,
            endDate: filterValues.enddate
          }
        })
        .then((response) => setRequests(response.data.getPetitionsByRequesterAndStatusAndDates))
        .catch((error) => customAlert("Ha ocurrido un error, por favor, intétalo más tarde o contacta con nuestro equipo de soporte"));
    
      }, [filterValues]);
      
      //Ale, aqui te dejo la función preparada para que implementes la pasarela de pago.
      function handleRequestPay(price){
        console.log(price)
      }



    const {data, loading} = useQuery(personalRequestsAPI.getPersonalPetitions, {variables: {
        username: localStorage.getItem('user','')
      }});

    return loading ? 
            <div className='carrousel-container'>Loading...</div>
        : (
            <FlatterPage withBackground userLogged>
                <div>
                    <h1 className="properties-title">Tus Solicitudes a otros Pisos</h1>
                </div>
                
                <section className="site-content-sidebar">
                    <aside className="sidebar">
                        <div className="card">
                        <FlatterForm
                            buttonText={"Filtrar"}
                            showSuperAnimatedButton
                            numberOfColumns={1}
                            inputs={filterRequestsInputs}
                            onSubmit={handleRequestFilter}
                            ref={filterFormRef}                
                        />
                        </div>
                        
                    </aside>

                    <div className="content content-list">
                        <div className="property-requests card">
                        
                    {
                    requests.map((request, index) => {
                        return(
                            <div className="property-request" key = {index}>
                                 <div className="request-data"> 
                                    <h2>{request.property.title}</h2>

                                    <div className="request-footer">
                                        <div className="request-footer-element">
                                            <div className="request-property-picture" onClick={() => navigate(`/property/${request.property.id}`)}>
                                                <img src={`${settings.API_SERVER_MEDIA}${request.property.images[0].image}`} alt="Inmueble"/>
                                             </div>

                                            <div className="request-user-data">
                                                <span className='request-price'>{request.property.price}/mes</span>
                                                <span>{request.property.province.name}
                                                 <img className='icon-img' src={require("../static/files/icons/ubicacion.png")} alt="Ubicacion"/>
                                                 </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='request-information'> 
                                    <div className='request-information-header'>
                                        <h4>Mensaje del Propietario</h4>
                                    </div>
                                    
                                {
                                    request.status === "P" ?
                                    (
                                        <div className='request-information-element2'>
                                            Buenas, {request.requester.firstName} {request.requester.lastName}. Su petición está a la espera de
                                            ser respondida por el Propietario del inmueble. Manténgase a la espera. 
                                        </div>
                                    )
                                    : request.status === "A" ?
                                    (
                                        <div className='request-information-element2'>
                                            Buenas, {request.requester.firstName} {request.requester.lastName}. Su petición ha sido aceptada
                                            .Tiene hasta el día {paymentDeadline(request.dateOfPetitionAcepted)} para abonar el primer pago de {request.property.price}€.
                                        </div>
                                    ) 

                                    : request.status === "D" ?
                                    (
                                        <div className='request-information-element2'>
                                            Buenas, {request.requester.firstName} {request.requester.lastName}. Su petición ha sido rechazada. 
                                            Lo sentimos.
                                        </div>
                                    )
                                    : (<div></div>)
                                    }
                                    
                                </div>
                                {
                                request.status === "P" ? 
                                    (<div className="request-actions">
                                        <div className='pending-status'>Pendiente</div>
                                    </div>
                                    )
                                : request.status === "A" ?
                                (
                                    <div className="request-actions">
                                          <SolidButton onClick={ () => {handleRequestPay(request.property.price)}} text="Pagar" className="pay" />
                                      </div> 
                                )
                                : request.status === "D" ?
                                (
                                    <div className="request-actions">
                                        <div className='rejected-status'>Rechazada</div>
                                    </div>
                                )
                                : (<div></div>)
                                }    

                                        
                                

                            </div>
                        );})}
                        </div>

                        
                    </div>
                </section>
            </FlatterPage>
        );
}

export default PersonalRequests;