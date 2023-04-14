import "../static/css/pages/propertyDetails.css";

import SlideShow from "../components/slider/slideShow";
import SmallProfile from "../components/profile/smallProfile";
import FlatterPage from "../sections/flatterPage";
import FlatterModal from "../components/flatterModal";
import FormProperty from "../components/forms/formProperty";
import Tag from "../components/tag";
import * as settings from "../settings";
import propertiesAPI from "../api/propertiesAPI";
import FlatterForm from "../components/forms/flatterForm";
import FavouriteButton from "../components/property/favouriteButton";
import customAlert from "../libs/functions/customAlert";
import { propertyRequestsInputs } from "../forms/propertyRequestsInputs";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import usersAPI from '../api/usersAPI';

const PropertyDetails = () => {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);
  let userToken = localStorage.getItem("token", '');
  const {data, loading} = useQuery(usersAPI.getPublicProfileByUsername, {variables: {
      username: localStorage.getItem("user"),
      userToken: userToken
  }});
  
  useEffect(() => {
      if (!loading && data && data.getUserByUsername) {
          setUserData(data.getUserByUsername);
      }
  }, [loading, data]);
  
  useEffect(() => {
      if (userData) {
          setProfile(userData);
      }
  }, [userData]);

  let [property, setProperty] = useState({});
  const editPropertyModalRef = useRef(null);

  const client = useApolloClient();
  const navigator = useNavigate();

  const propertyRequestModalRef = useRef(null);
  const propertyRequestFormRef = useRef(null);

  const { id } = useParams();

  const { loading: propertyLoading, data: propertyData } = useQuery(
    propertiesAPI.getPropertyById,
    {
      variables: {
        id: parseInt(id),
        userToken: userToken,
      },
      fetchPolicy: "no-cache",
    }
  );

  const { loading: propertyRequestsLoading, data: propertyRequestsData } =
    useQuery(propertiesAPI.getPropertyRequestsByUsername, {
      variables: {
        requesterUsername: localStorage.getItem("user"),
        propertyId: parseInt(id),
        userToken: userToken,
      },
    });

  if (propertyLoading || propertyRequestsLoading) return <p>Loading...</p>;

  const userRequest =
    propertyRequestsData.getPetitionByRequesterToProperty[0] ?? false;

  const handlePropertyRequest = ({ values }) => {
    client
      .mutate({
        mutation: propertiesAPI.createPropertyRequest,
        variables: {
          requesterUsername: localStorage.getItem("user"),
          propertyId: parseInt(id),
          message: values.message,
          userToken: userToken,
        },
      })
      .then((response) => {
        propertyRequestModalRef.current.close();
        window.location.reload();
      })
      .catch((error) => customAlert(error.message, 'error'));
  };

  const handleCancelRequest = (e) => {
    client
      .mutate({
        mutation: propertiesAPI.removePropertyRequest,
        variables: {
          requestId: parseInt(userRequest.id),
          userToken: userToken,
        },
      })
      .then((response) => {
        propertyRequestModalRef.current.close();
        window.location.reload();
      })
      .catch((error) => customAlert(error.message, 'error'));
  };
  return (
    <FlatterPage withBackground userLogged withAds={false}>
      <div className="property-housing-page">
        <section className="property-housing">
          <div className="property-housing__photo">
            <div className="property-photo-container">
              <SlideShow
                images={propertyData.getPropertyById.images.map(
                  (image) => settings.API_SERVER_MEDIA + image.image
                )}
              />
            </div>
          </div>
          <div className="property-housing__info">
            <div className="property-title">
              <h1>{propertyData.getPropertyById.title}</h1>
              <span>
                {propertyData.getPropertyById.location}, {propertyData.getPropertyById.municipality.name}, {propertyData.getPropertyById.province.name}
              </span>
            </div>
            <div className="property-price">
              <span>{propertyData.getPropertyById.price}</span>{" "}
              <span>€/mes</span>
            </div>
            <div className="property-description">
              <h3>Descripción</h3>
              <p>{propertyData.getPropertyById.description}</p>
            </div>
            <div className="property-tags-row">
              {propertyData.getPropertyById.tags.map((tag, index) => (
                <div className="tagDiv" onClick={() => navigator(`/search?tag=${tag.name}`)}>
                  <Tag key={index} name={tag.name} color={tag.color} />
                </div>
              ))}
            </div>

            <div className="property-btn__container">

              {localStorage.getItem("roles") &&
                localStorage.getItem("roles").includes("RENTER") &&
                localStorage.getItem("user") !==
                  propertyData.getPropertyById.owner.username && (
                  <FavouriteButton
                    isFavourite={propertyData.getPropertyById.interestedUsers
                      .map(
                        (user) => user.username === localStorage.getItem("user")
                      )
                      .some((value) => value)}
                    propertyId={id}
                  />
                )
              }

              {/* RENDERIZACIÓN DEL BOTON POR VALIDAR */}
              {propertyData.getPropertyById.owner.username !==
              localStorage.getItem("user") ? (
                userRequest === false ? (
                  <button
                    className="property-btn"
                    style={{ textTransform: "uppercase", marginLeft: "auto" }}
                    onClick={() => {
                      propertyRequestModalRef.current.open();
                    }}
                  >
                    <>
                      <img
                        className="property-img"
                        src={require("../static/files/icons/lapiz.png")}
                        alt="Petición"
                      />
                      Solicitar
                    </>
                  </button>
                ) : (
                  <button
                    className="property-btn red outlined"
                    style={{ textTransform: "uppercase", marginLeft: "auto" }}
                    onClick={handleCancelRequest}
                  >
                    <>
                      <img
                        className="property-img"
                        src={require("../static/files/icons/lapiz.png")}
                        alt="Petición"
                      />
                      Cancelar
                    </>
                  </button>
                )
              ) : (
                <></>
              )}

              
                {localStorage.getItem("user") ===
                propertyData.getPropertyById.owner.username ? (
                  <button
                    className="property-btn"
                    onClick={() => {
                      setProperty(propertyData.getPropertyById);
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
                  <button
                    className="property-btn"
                  >
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
          {propertyData.getPropertyById.flatmates.length !== 0 && (
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
                {propertyData.getPropertyById.flatmates.map((user, index) => (
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
            <SmallProfile user={propertyData.getPropertyById.owner} />
          </section>
        </section>
      </div>

      <FlatterModal
        maxWidth={500}
        maxHeight={500}
        ref={propertyRequestModalRef}
      >
        <h1 className="comments-form-title">Solicitar alquiler</h1>
        {
          profile &&
          <FlatterForm
            buttonText="Solicitar"
            showSuperAnimatedButton
            numberOfColumns={1}
            inputs={propertyRequestsInputs(profile.firstName+" "+profile.lastName, profile.age, profile.profession)}
            onSubmit={handlePropertyRequest}
            ref={propertyRequestFormRef}
        ></FlatterForm>
        }
      </FlatterModal>
      <FlatterModal maxWidth={700} ref={editPropertyModalRef}>
        <FormProperty property={property} />
      </FlatterModal>
    </FlatterPage>
  );
};

export default PropertyDetails;
