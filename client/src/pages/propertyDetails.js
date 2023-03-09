import "../static/css/pages/propertyDetails.css";

import SlideShow from "../components/slider/slideShow";
import SmallProfile from "../components/profile/smallProfile";
import FlatterPage from "../sections/flatterPage";
import Tag from "../components/tag";

import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import * as settings from "../settings";

const PropertyDetails = () => {
  const { id } = useParams();

  const GET_PROPERTY = gql`
  {
    getPropertyById(id: ${id}) {
      title
      location
      province
      description
      price
      owner {
        username
        firstName
        lastName
        profilePicture
      }
      images {
          image
      }
      tags {
        name
        color
      }
      flatmates {
        firstName
        lastName
        profilePicture
      }
    }
  }
  `;

  const { loading, data } = useQuery(GET_PROPERTY);

  if (loading) return <p>Loading...</p>;

  return (
    <FlatterPage withBackground userLogged>
      <div className="housing-page">
        <section className="housing">
          <div className="housing__photo">
            <div className="photo-container">
              <SlideShow
                images={data.getPropertyById.images.map(
                  (image) => settings.API_SERVER_MEDIA + image.image
                )}
              />
            </div>
          </div>
          <div className="housing__info">
            <div className="title">
              <h1>{data.getPropertyById.title}</h1>
              <span>LOCALIZACIÓN: {data.getPropertyById.province}, {data.getPropertyById.location}</span>
            </div>
            <div className="price">
              <span>{data.getPropertyById.price}€/mes</span>
            </div>
            <div className="description">
              <h3>Descripción</h3>
              <p>{data.getPropertyById.description}</p>
            </div>
            <div className="tags-row">
              {data.getPropertyById.tags.map((tag, index) => (
                <Tag key={index} name={tag.name} color={tag.color} />
              ))}
            </div>
            <div className="btn__container">
              <button className="btn">
                {localStorage.getItem("user") ===
                data.getPropertyById.owner.username ? (
                  <>
                    <img
                      src={require("../static/files/icons/lapiz.png")}
                      alt="lapiz icon"
                    />
                    EDITAR
                  </>
                ) : (
                  <>
                    <img
                      src={require("../static/files/icons/chat-icon.png")}
                      alt="chat icon"
                    />
                    CONTACTAR
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
        <section className="people">
          {data.getPropertyById.flatmates.length !== 0 && (
            <section className="flatmates">
              <div className="container__title">
                <img
                  src={require("../static/files/icons/usuario.png")}
                  alt="user icon"
                />
                <h1>Compañeros</h1>
              </div>

              <div className="flatmates__container">
                {data.getPropertyById.flatmates.map((user, index) => (
                  <SmallProfile key={index} user={user} />
                ))}
              </div>
            </section>
          )}
          <section className="owner">
            <div className="container__title">
              <img
                src={require("../static/files/icons/estrella.png")}
                alt="star icon"
              />
              <h1>Propietario</h1>
            </div>
            <SmallProfile user={data.getPropertyById.owner} />
          </section>
        </section>
      </div>
    </FlatterPage>
  );
};

export default PropertyDetails;
