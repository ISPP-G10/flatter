import '../static/css/pages/listProperties.css'

import FlatterPage from "../sections/flatterPage";
import propertyRequestsAPI from '../api/propertyRequestsAPI';
import * as settings from "../settings";
import customAlert from "../libs/functions/customAlert";
import { useQuery, useApolloClient } from '@apollo/client';
import SolidButton from '../sections/solidButton';
import FlatterForm from '../components/forms/flatterForm';
import { filterRequestsInputs } from '../forms/filterRequestsForm';
import { useNavigate } from "react-router-dom";
import useURLQuery from "../hooks/useURLQuery";
import { useState, useEffect, useRef } from "react";

const PropertyRequests = () => {

    const navigate = useNavigate();
    const client = useApolloClient();
    const query = useURLQuery();
    const filterFormRef = useRef(null);

    function acceptPetition(petitionId){

        client.mutate({
            mutation: propertyRequestsAPI.updateStatusPetition,
            variables: {
                petitionId: parseInt(petitionId),
                statusPetition: true
            }
        }).then((response) => {
            window.location.reload();
        }).catch((error) => {
            customAlert(error.message);
        });
    
      }

    function rejectPetition(petitionId){

        client.mutate({
            mutation: propertyRequestsAPI.updateStatusPetition,
            variables: {
                petitionId: parseInt(petitionId),
                statusPetition: false
            }
        }).then((response) => {
            window.location.reload();
        }).catch((error) => {
            customAlert(error.message);
        });
    
    }

    let [filterValues, setFilterValues] = useState({
        username : localStorage.getItem('user',''),
        status: query.get("status"),
        startdate: query.get("startdate" ?? ''),
        enddate: query.get("enddate" ?? ''),
      });
    
    let [requests, setRequests] = useState([]);

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
          query: propertyRequestsAPI.getPetitions,
          variables: {
            username: filterValues.username,
            status: filterValues.status,
            startDate: filterValues.startdate,
            endDate: filterValues.enddate
          }
        })
        .then((response) => setRequests(response.data.getPetitionsByStatusAndUsernameAndDates))
        .catch((error) => customAlert("Ha ocurrido un error, por favor, intétalo más tarde o contacta con nuestro equipo de soporte"));
    
      }, [filterValues]);
      




    const {data, loading} = useQuery(propertyRequestsAPI.getPetitions, {variables: {
        username: localStorage.getItem('user','')
      }});

    return loading ? 
            <div className='carrousel-container'>Loading...</div>
        : (
            <FlatterPage withBackground userLogged>
                <div>
                    <h1 className="properties-title">Solicitudes de Alquiler</h1>
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
                        
                            {/* {requests.map((values, index) => {
                                return(
                                    {}
                                );
                                })}
                                */}
                    {
                    requests.map((request, index) => {
                        return(
                            <div key = {index} className="property-request">
                                <div className="request-data">
                                    <h2>{request.property.title}</h2>

                                    <div className="request-footer">
                                        <div className="request-footer-element">
                                            <div className="request-user-picture" onClick={() => navigate(`/profile/${request.requester.username}`)}>
                                                <img src={settings.API_SERVER_MEDIA + request.requester.profilePicture} alt="Avatar"/>
                                            </div>

                                            <div className="request-user-data">
                                                <span>{request.requester.firstName} {request.requester.lastName}</span>
                                                <span>{parseFloat(request.requester.averageRating).toFixed(2)}/5.00
                                                <img className='icon-img' src={require("../static/files/icons/yellow-star.png")} alt="Icono estrella"/>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="request-footer-element">
                                            <span>{request.property.maxCapacity} 
                                                <img className='icon-img' src={require("../static/files/icons/partners.png")} alt="Icono Capacidad vivienda"/>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='request-information'> 
                                    <div className='request-information-header'>
                                        <h4>Mensaje del Solicitante</h4>
                                    </div>
                                    <div className='request-information-element'>
                                        {request.message}
                                    </div>
                                </div>
                                {
                                request.status === "P" ? 
                                    (<div className="request-actions">
                                        <SolidButton onClick={ () => {acceptPetition(request.id)}} text="Aceptar" className="accept" />

                                        <SolidButton onClick={ () => {rejectPetition(request.id)}} text="Rechazar" className="reject" />
                                    </div>)
                                : request.status === "A" ?
                                (
                                    <div className="request-actions">
                                        <div className='accepted-status'>Aceptada</div>
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

export default PropertyRequests;