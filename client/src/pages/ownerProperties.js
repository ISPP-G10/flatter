import "../static/css/pages/ownerProperties.css";
import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";

import { useParams } from "react-router-dom";

import SolidButton from "../sections/solidButton";
import Tag from "../components/tag";
import MultiRangeSlider from "../components/inputs/multiRangeSlider";

const OwnerProperties = () => {

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

return (
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Todas tus propiedades</h1>
      </div>
  
      <section className="site-content-sidebar properties">
        <div className="sidebar">
          <div className="card">
            <h3>Filtrar por</h3>
  
            <label>
              Ciudad
              <input type="text" name="province" placeholder="Selecciona ciudad" />
            </label>
  
            <label>
              Precio
              <MultiRangeSlider min="5" max="2000"/>
            </label>
  
            <label>
              <SolidButton text="Buscar" />
            </label>
          </div>
        </div>
  
        <div className="content">
          {properties.map((property) => (
            <article key={property.id} className="property-card card">
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
                    {property.tags.map((tag) => (
                      <Tag name={tag.title} color={tag.color}></Tag>
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
    </FlatterPage>
  );
};

export default OwnerProperties;