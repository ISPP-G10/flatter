import "../static/css/pages/propertyDetails.css";

import SlideShow from "../components/slider/slideShow";
import SmallProfile from "../components/profile/smallProfile";
import FlatterPage from "../sections/flatterPage";
import FlatterModal from "../components/flatterModal";
import FormProperty from "../components/forms/formProperty";
import Tag from "../components/tag";

import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import * as settings from "../settings";
import propertiesAPI from "../api/propertiesAPI";

import { useState, useRef } from "react";
import FavouriteButton from "../components/property/favouriteButton";
import { useEffect } from "react";

const PropertyDetails = () => {
  let [property, setProperty] = useState({});
  const editPropertyModalRef = useRef(null);

  const { id } = useParams();

  const { loading, data, refetch } = useQuery(propertiesAPI.getPropertyById, {
    variables: {
      id: parseInt(id),
    },
  });

  useEffect(() => {
    refetch();
  });

  if (loading) return <p>Loading...</p>;

  return (
    <FlatterPage withBackground userLogged>
      <div className="property-housing-page">
        <section className="property-housing">
          <div className="property-housing__photo">
            <div className="property-photo-container">
              <SlideShow
                images={data.getPropertyById.images.map(
                  (image) => settings.API_SERVER_MEDIA + image.image
                )}
              />
            </div>
          </div>
          <div className="property-housing__info">
            <div className="property-title">
              <h1>{data.getPropertyById.title}</h1>
              <span>
                LOCALIZACIÓN: {data.getPropertyById.province},{" "}
                {data.getPropertyById.location}
              </span>
            </div>
            <div className="property-price">
              <span>{data.getPropertyById.price}</span> <span>€/mes</span>
            </div>
            <div className="property-description">
              <h3>Descripción</h3>
              <p>{data.getPropertyById.description}</p>
            </div>
            <div className="property-tags-row">
              {data.getPropertyById.tags.map((tag, index) => (
                <Tag key={index} name={tag.name} color={tag.color} />
              ))}
            </div>

            <div className="property-btn__container">
              <FavouriteButton
                isFavourite={data.getPropertyById.interestedUsers
                  .map((user) => user.username === localStorage.getItem("user"))
                  .some((value) => value)}
                propertyId={id}
              />
              {localStorage.getItem("user") ===
              data.getPropertyById.owner.username ? (
                <button
                  className="property-btn"
                  onClick={() => {
                    setProperty(data.getPropertyById);
                    editPropertyModalRef.current.open();
                  }}
                >
                  <img
                    className="property-img"
                    src={require("../static/files/icons/lapiz.png")}
                    alt="lapiz icon"
                  />
                  EDITAR
                </button>
              ) : (
                <button className="property-btn">
                  <img
                    className="property-img"
                    src={require("../static/files/icons/chat-icon.png")}
                    alt="chat icon"
                  />
                  CONTACTAR
                </button>
              )}
            </div>
          </div>
        </section>
        <section className="property-people">
          {data.getPropertyById.flatmates.length !== 0 && (
            <section className="property-flatmates">
              <div className="property-container__title">
                <img
                  className="property-img"
                  src={require("../static/files/icons/usuario.png")}
                  alt="user icon"
                />
                <h1>Compañeros</h1>
              </div>

              <div className="property-flatmates__container">
                {data.getPropertyById.flatmates.map((user, index) => (
                  <SmallProfile key={index} user={user} />
                ))}
              </div>
            </section>
          )}
          <section className="property-owner">
            <div className="property-container__title">
              <img
                className="property-img"
                src={require("../static/files/icons/estrella.png")}
                alt="star icon"
              />
              <h1>Propietario</h1>
            </div>
            <SmallProfile user={data.getPropertyById.owner} />
          </section>
        </section>
      </div>
      <FlatterModal maxWidth={700} ref={editPropertyModalRef}>
        <FormProperty property={property} />
      </FlatterModal>
    </FlatterPage>
  );
};

export default PropertyDetails;
