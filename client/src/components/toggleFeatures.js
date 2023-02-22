import { useState, useEffect, useRef } from "react";

const ToggleFeatures = () => {

    const [indexToggled, setIndexToggled] = useState(0);

    const scheme = [
        {
            image: require("../static/files/images/mockup-propietarios.png"),
            title: 'Cómo funciona nuestra web',
            subtitle: '¡Entra en nuestra comunidad! Crea una cuenta y publica la/s vivienda/s que te gustaría alquilar. Solo debes preocuparte de aceptar o denegar solicitudes, ¡el resto lo hacemos nosotros!',
            children: [
                {
                    image: require("../static/files/icons/upload.png"),
                    title: 'Subir ofertas',
                    description: 'Tu especificas los detalles. Simplemente da la información y dejanos darle visibilidad a tu vivienda en nuestra comunidad'
                }, {
                    image: require("../static/files/icons/lista-de-verificacion.png"),
                    title: 'Recibir solicitudes',
                    description: 'Flatter te ayudará con tus evaluaciones y localización de posibles inquilinos'
                }, {
                    image: require("../static/files/icons/resenas.png"),
                    title: 'Evalúa a tus inquilinos',
                    description: 'Manten una comunicación clara y efectiva en la relación arrendador-inquilino. Siempre podrá valorar a sus arrendatarios y compartir su experiencia al finalizar el contrato'
                }, {
                    image: require("../static/files/icons/candado.png"),
                    title: 'Pago seguro',
                    description: 'Al alquilar tu vivienda a través de nuestra plataforma puedes disfrutar de un seguro de alquiler sin complicaciones. Nosotros te llevamos el papeleo'
                }
            ]
        }, {
            image: require("../static/files/images/mockup-inquilinos.png"),
            title: 'Cómo funciona nuestra web',
            subtitle: '¡Entra en nuestra comunidad y encuentra el piso y los compañeros perfectos para vivir! Publica la/s vivienda/s que te gustaría alquilar y valora a otros usuarios.',
            children: [
                {
                    image: require("../static/files/icons/conversation.png"),
                    title: 'Conoce a tus compañeros',
                    description: 'A través de Flatter puedes contactar con otros usuarios y formar grupos. ¡Así conocerás las manías, gustos y aficiones de las personas con las que convivirás antes de firmar el contrato!'
                }, {
                    image: require("../static/files/icons/habilidad.png"),
                    title: 'Valora a los propietarios',
                    description: 'Puedes influir en la reputación de un arrendador en la plataforma. ¡Así otros usuarios podrán conocer tu experiencia y valorarla!'
                }, {
                    image: require("../static/files/icons/user-likes.png"),
                    title: 'Personaliza tu perfil',
                    description: 'Podrás detallar tus gustos y preferencias para que otros usuarios puedan conocer mejor tu personalidad. Además, te ayudará a encontrar compañeros con los que te sientas cómod@'
                }, {
                    image: require("../static/files/icons/resenas.png"),
                    title: 'Valora a tus compañeros',
                    description: 'Al finalizar el contrato, podrás valorar a tus compañeros de piso y compartir tu experiencia. Aunque estas reseñas sean las que más influyen, también puedes valorar a otros usuarios en cualquier momento'
                }
            ]
        }
    ]

    const toggleToIndex = (index) => {

        ownersImageToggler.current.style.animation = "rounded-shake 1s";
        rentersImageToggler.current.style.animation = "rounded-shake 1s";
        setIndexToggled(index);
        setTimeout(() => {
            ownersImageToggler.current.style.animation = "";
            rentersImageToggler.current.style.animation = "";
        }, 1000);
    }

    const chosenToggle = scheme[indexToggled];
    const toggleActionClass = indexToggled ? 'selected-right' : 'selected-left';
    const ownersImageToggler = useRef(null);
    const rentersImageToggler = useRef(null);

    useEffect(() => {
        if (indexToggled === 0) {
            ownersImageToggler.current.style.display = 'block';
            rentersImageToggler.current.style.display = 'none';
        } else {
            ownersImageToggler.current.style.display = 'none';
            rentersImageToggler.current.style.display = 'block';
        }
    }, [indexToggled]);

    return (
        <div className="toggle-features">
            <div>
                <div>
                    <img key={`image_toggle_owners`} src={scheme[0].image} alt={`image_toggle_owner`} ref={ownersImageToggler}/>
                    <img key={`image_toggle_renter`} src={scheme[1].image} alt={`image_toggle_renter`} ref={rentersImageToggler}/>
                </div>
                <div>
                    <>
                        <h2>{chosenToggle.title}</h2>
                        <p>{chosenToggle.subtitle}</p>
                    </>
                        
                    <div className="toggle card">
                        <div className={ `toggle-action ${toggleActionClass}` }>
                            <div onClick={() => {toggleToIndex(0)}} style={{fontWeight: 'bolder'}}>
                                PROPIETARIO
                            </div>
                            <div onClick={() => {toggleToIndex(1)}} style={{fontWeight: 'bolder'}}>
                                INQUILINO
                            </div>
                        </div>

                    </div>

                    <div className="toggle-content">
                        { chosenToggle.children.map((child, index) => {
                            return (
                                <div key={`toggle-children-${index}`}>
                                    <div className="toggle-content-img-row">
                                        <div className="toggle-content-img card">
                                            <img src={ child.image } alt={`toggle-children-${index}`} />
                                        </div>
                                    </div>
                                    
                                    <h3>{ child.title }</h3>
                                    <p>{ child.description }</p>
                                    
                                </div>
                            );
                        }) }
                    </div>

                </div>


            </div>
        

        </div>
    );

}

export default ToggleFeatures;