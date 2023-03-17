import '../static/css/pages/listProperties.css'

import FlatterPage from "../sections/flatterPage";
import propertiesAPI from '../api/propertiesAPI';

import { useQuery } from '@apollo/client';
import SolidButton from '../sections/solidButton';

const PropertyRequests = () => {

    const {loading, data} = useQuery(propertiesAPI.getOutstandingProperties);

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
                            esto es un sidebar
                        </div>
                        
                    </aside>

                    <div className="content content-list">
                        <div className="property-requests card">
                            
                            <div className="property-request">
                                <div className="request-data">
                                    <h2>Solicitud de propiedad a asdadasdasd as asdasd asd</h2>

                                    <div className="request-footer">
                                        <div class="request-footer-element">
                                            <div className="request-user-picture">
                                                <img src="" />
                                            </div>

                                            <div className="request-user-data">
                                                <a href="#">Sandra García Jiménez</a>
                                                <span>3 (iconoEstrella.png)</span>
                                            </div>
                                        </div>

                                        <div class="request-footer-element">
                                            <span>3 (iconoPersonas.png)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="request-actions">
                                    <SolidButton onclick={ () => {

                                    } } text="Aceptar" className="accept" />

                                    <SolidButton onclick={ () => {

                                    } } text="Cancelar" className="reject" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </FlatterPage>
        );
}

export default PropertyRequests;