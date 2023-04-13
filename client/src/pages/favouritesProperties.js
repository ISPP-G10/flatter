import "../static/css/pages/listProperties.css";

import FlatterPage from "../sections/flatterPage";
import Slider from "../components/slider/slider";
import SolidButton from "../sections/solidButton";
import Tag from "../components/tag";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import propertiesAPI from "../api/propertiesAPI";

const FavouritesProperties = () => {
  const navigator = useNavigate();

  const { loading, data } = useQuery(
    propertiesAPI.getFavouritePropertiesByUser,
    {
      variables: {
        username: localStorage.getItem("user"),
      },
      fetchPolicy: "no-cache",
    }
  );

  if (loading) return <p>Loading...</p>;

  return (
    <FlatterPage withBackground userLogged>
      <div>
        <h1 className="properties-title">Mis pisos favoritos</h1>
      </div>

      <section className="site-content-sidebar properties">
        <div className="content">
          {data.getFavouriteProperties.map((property, index) => {
            return (
              <article key={index} className="property-card card">
                <div className="property-gallery">
                  <Slider
                    images={property.images.map((image) => image.image)}
                  />
                </div>
                <div className="property-body">
                  <div className="property-body-content">
                    <div className="property-header">
                      <h3>{property.title}</h3>
                      <p>{property.description}</p>
                    </div>
                    <div className="property-price">
                      <span>{property.price}</span> <span>€/mes</span>
                    </div>
                  </div>

                  <div className="property-meta">
                    <div className="meta-right">
                      {property.tags &&
                        property.tags.map((tag, index) => (
                          <div className="tagDiv" onClick={() => navigator(`/search?tag=${tag.name}`)}>
                            <Tag
                              key={index}
                              name={tag.name}
                              color={tag.color}
                            ></Tag>
                          </div>
                        ))}
                    </div>

                    <div className="meta-left">
                      <div className="meta-location">
                        <img
                          className="small-picture-back"
                          src={require("../static/files/icons/ubicacion.png")}
                          alt="Ubicacion"
                        />{" "}
                        {property.location}, {property.municipality.name}, {property.province.name}
                      </div>

                      <div className="meta-flatmates">
                        <img
                          className="small-picture-back"
                          src={require("../static/files/icons/partners.png")}
                          alt="Compañeros"
                        />{" "}
                        {property.flatmates.length}/{property.maxCapacity}
                      </div>
                    </div>
                  </div>

                  <footer className="property-footer">
                    <SolidButton
                      text="Ver piso"
                      onClick={() => {
                        navigator(`/property/${property.id}`);
                      }}
                    />
                    <SolidButton text="Ver reseñas" />
                    <SolidButton text="Compartir" />
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </FlatterPage>
  );
};

export default FavouritesProperties;
