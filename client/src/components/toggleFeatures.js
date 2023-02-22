import { useState } from "react";

const ToggleFeatures = () => {

    const [indexToggled, setIndexToggled] = useState(0);

    const scheme = [
        {
            image: require("../static/files/images/flatter-features.png"),
            title: 'Cómo funciona nuestra web',
            subtitle: 'Entra ya en nuestra comunidad, crea una cuenta y encuentra el piso perfecto a través de valoraciones y comentarios honestos de otros inquilinos.',
            children: [
                {
                    image: require("../static/files/icons/upload.png"),
                    title: 'Sube una oferta',
                    description: 'Tu especificas los detalles. Simplemente da la información y dejanos darle visibilidad en nuestra comunidad'
                }, {
                    image: require("../static/files/icons/lista-de-verificacion.png"),
                    title: 'Recibe una oferta',
                    description: 'Flatter te ayudará con tus evaluaciones y localización de posibles inquilinos'
                }, {
                    image: require("../static/files/icons/resenas.png"),
                    title: 'Evalúa a tus inquilinos',
                    description: 'Manten una comunicación clara y efectiva en la relación arrendador-inquilino'
                }
            ]
        }, {
            image: require("../static/files/images/flatter-features.png"),
            title: 'Título del segundo toggle',
            subtitle: 'Entra ya en nuestra comunidad, crea una cuenta y encuentra el piso perfecto a través de valoraciones y comentarios honestos de otros inquilinos.',
            children: [
                {
                    image: require("../static/files/images/flatter-features.png"),
                    title: 'Prueba 3',
                    description: 'Esto es una prueba'
                }, {
                    image: require("../static/files/images/flatter-features.png"),
                    title: 'Prueba 4',
                    description: 'Esto es una prueba'
                }, {
                    image: require("../static/files/images/flatter-features.png"),
                    title: 'Prueba 4',
                    description: 'Esto es una prueba'
                }
            ]
        }
    ]

    const toggleToIndex = (index) => {
        setIndexToggled(index);
    }

    const chosenToggle = scheme[indexToggled];

    const toggleActionClass = indexToggled ? 'selected-right' : 'selected-left';

    return (
        <div className="toggle-features">
            <div>
                <div>
                    <img key={`image_toggle_${indexToggled}`} src={chosenToggle.image} alt={`image_toggle_${indexToggled}`}/>
                </div>
                <div>
                    <>
                        <h2>{chosenToggle.title}</h2>
                        <p>{chosenToggle.subtitle}</p>
                    </>
                        
                    <div className="toggle card">
                        <div className={ `toggle-action ${toggleActionClass}` }>
                            <div onClick={() => {toggleToIndex(0)}}>
                                Soy particular
                            </div>
                            <div onClick={() => {toggleToIndex(1)}}>
                                Soy propietario
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