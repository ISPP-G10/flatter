import FlatterPage from '../sections/flatterPage';
import Hero from '../sections/hero';

import ModalProperty from '../components/modalProperty';

import SolidButton from '../sections/solidButton';

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import '../static/css/pages/property.css';

const PropertyPage = ({}) => {

    let [galleryIndex, setGalleryIndex] = useState(0);

    const exampleProperty = {
        id: 1,
        title: "Elegante y magífica chavola",
        description: `¿Estás buscando un lugar acogedor y espacioso para vivir? ¡No busques más! Tenemos la solución perfecta para ti. En nuestra comunidad de apartamentos, estamos ofreciendo una habitación en un piso de 100m2 con 2 cuartos de baño y 3 habitaciones. Este espacio es ideal para aquellos que buscan un lugar para llamar hogar y compartir con amigos o compañeros de piso.

        Al alquilar una habitación en nuestro piso, tendrás acceso a todas las comodidades que necesitas para vivir cómodamente. La cocina está completamente equipada con electrodomésticos modernos, lo que te permitirá cocinar tus comidas favoritas en casa. Además, tenemos una amplia sala de estar donde podrás relajarte después de un largo día, y un comedor donde podrás compartir tus comidas con otros habitantes del piso.
        
        Nuestro piso cuenta con 2 baños, por lo que nunca tendrás que preocuparte por hacer fila por el baño por las mañanas. Ambos baños tienen duchas modernas y están equipados con todo lo que necesitas para tu aseo diario.
        
        Cada habitación del piso está diseñada para brindarte comodidad y privacidad. Las habitaciones son amplias y cuentan con amplios armarios y ventanas que permiten la entrada de luz natural. También hay suficiente espacio en cada habitación para que puedas personalizarla y hacerla sentir como en casa.
        
        En cuanto a la ubicación, nuestro piso se encuentra en una zona muy cómoda y tranquila. Estamos ubicados cerca de tiendas, restaurantes, parques y transporte público. Podrás llegar a cualquier parte de la ciudad fácilmente desde aquí.`,
        gallery: [
            'https://images.unsplash.com/photo-1597047084897-51e81819a499?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
            'https://images.unsplash.com/photo-1464890100898-a385f744067f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
            'https://images.unsplash.com/photo-1529408632839-a54952c491e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
            'https://images.unsplash.com/photo-1531383339897-f369f6422e40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
            'https://images.unsplash.com/photo-1548777137-2235b9fd3222?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',

        ],
        tags: [
            {
                title: "Elegante",
                color: "pink"
            },
            {
                title: "Social",
                color: "purple"
            }
        ]
    }

    const { id } = useParams();

    const getPropertyId = (id) => {
        console.log(id);
        return exampleProperty;
    }

    const property = getPropertyId(id);

    const changeHeroBg = (horizontalBackground, verticalBackground) => {

    }

    return (
        <FlatterPage>
            <Hero height={50} horizontalBackground="hero-home-background.jpg" verticalBackground="hero-home-vertical-bg.jpg" class="property">

            </Hero>
            <article className="property-body">
                <aside className="property-sidebar">
                    <div className="property-gallery">
                        <div className="property-gallery-main">
                            <img src={ property.gallery[galleryIndex] } />
                        </div>
                        <div className="property-gallery-thumbs">
                            {property.gallery.map((image, index) => {
                                if (index !== galleryIndex) {
                                    return <img key={index} src={image} onClick={() => setGalleryIndex(index)} />;
                                }
                            })}
                        </div>
                    </div>
                </aside>
                <div className="property-content">
                    <div className="property-content-title glass">
                        <h1>{ property.title }</h1>

                        <div className="property-content-subtitle">
                            <div className="property-subtitle-left">
                                { property.tags.map((tag, index) => (
                                    <div
                                    key={index}
                                    className="property-tag"
                                    style={{ backgroundColor: tag.color }}
                                    >
                                    {tag.title}
                                    </div>
                                )) }
                            </div>

                            <div className="property-subtitle-right">
                                <SolidButton modalid="edit-property" text="Editar Propiedad" />
                            </div>
                        </div>
                    </div>
                    <div className="property-content-description">
                        { property.description }
                    </div>
                </div>
            </article>

            <ModalProperty />
        </FlatterPage>
    )
}

export default PropertyPage;