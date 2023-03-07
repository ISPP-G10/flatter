import "../static/css/pages/ownerProperties.css";

import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import SolidButton from "../sections/solidButton";
import Tag from "../components/tag";
import FlatterForm from "../components/forms/flatterForm";
import FlatterModal from "../components/flatterModal";
import FormProperty from "../components/forms/formProperty";

import { useParams } from "react-router-dom";
import { useRef } from "react";
import { filterInputs } from "../forms/filterPropertiesForm";

const OwnerProperties = () => {

  const addPropertyModalRef = useRef(null);

    const exampleProperty = {
        id: 1,
        title: "Elegante y magífica chavola",
        description: `¿Estás buscando un lugar acogedor y espacioso para vivir? ¡No busques más! Tenemos la solución perfecta para ti. En nuestra comunidad de apartamentos, estamos ofreciendo una habitación en un piso de 100m2`,
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
                color: "#f44336"
            },
            {
                title: "Social",
                color: "purple"
            }
        ]
    }

const { page } = useParams();

// TODO si no se encuentra el id o ha sido proporcionado algo diferente
// a un integer mayor que 0, se devuelve false y redirección a 404
const getProperties = (page) => {
    return [exampleProperty, exampleProperty, exampleProperty, exampleProperty, exampleProperty, exampleProperty, exampleProperty, exampleProperty];
}

const properties = getProperties(page);

const handleFilterForm = () => {

}

return (
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Todas tus propiedades</h1>
      </div>
  
      <div className="over-listing">
        <div className="actions">
          <SolidButton text="Nueva Propiedad" type="" onClick={ () => { 
              addPropertyModalRef.current.open();
          } } />
        </div>
      </div>
      <section className="site-content-sidebar properties">
        <div className="sidebar">
          <div className="card">
            <div className="filters">
              <h3>Filtrar por</h3>

              <FlatterForm inputs={filterInputs} onSubmit={handleFilterForm} buttonText="Filtrar Propiedades" />
            </div>
          </div>
        </div>
  
        <div className="content">
          {properties.map((property, index) => (
            <article key={ index } className="property-card card">
              <div className="property-gallery">
                <Slider>
                </Slider>
              </div>
              <div className="property-body">
                <div className="property-body-content">
                  <h3>{property.title}</h3>
                  <p>{property.description}</p>
                </div>
  
                <div className="property-meta">
                  <div className="meta-right">
                    {property.tags.map((tag, index) => (
                      <Tag key={ index } name={tag.title} color={tag.color}></Tag>
                    ))}
                  </div>
  
                  <div className="meta-left">
                    <div className="meta-location">{ property.province }</div>
  
                    <div className="meta-flatmates">2/4</div>
                  </div>
                </div>
  
                <footer className="property-footer">
                  <SolidButton text="Destacar" />
                  <SolidButton text="Editar" />
                  <SolidButton text="Borrar" />
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FlatterModal maxWidth={700} ref={addPropertyModalRef}>
        <FormProperty property={{}} />
      </FlatterModal>
    </FlatterPage>
  );
};

export default OwnerProperties;