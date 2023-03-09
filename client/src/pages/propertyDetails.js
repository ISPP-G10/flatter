import "../static/css/pages/propertyDetails.css";

import SlideShow from "../components/slider/slideShow";
import SmallProfile from "../components/profile/smallProfile";
import FlatterPage from "../sections/flatterPage";
import Tag from "../components/tag";

const PropertyDetails = () => {
  const piso = {
    id: 45999,
    name: "Piso en C/Luis Montoto",
    description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    Voluptates totam vitae, eaque culpa quod possimus, numquam at,
    dolorum animi similique accusantium! Nulla exercitationem
    laudantium obcaecati pariatur. Obcaecati officia corporis
    voluptates tempora nam similique, doloremque esse animi fugit quae
    nulla sed?`,
    price: 200,
    flatmates: [
      {
        name: "Carlos Duarte",
        job: "Trabajador textil",
        rating: 4.9,
        avatar: require("../static/files/images/estudiante1.jpeg"),
      },
      {
        name: "Lucía López García",
        job: "Estudiante Enfermería",
        rating: 4.13,
        avatar: require("../static/files/images/estudiante2.jpeg"),
      },
    ],
    owner: {
      name: "Jose Javier Pérez García",
      job: "Jubilado",
      rating: 5.0,
      avatar: require("../static/files/images/propietario.jpeg"),
    },
    images: [
      "https://img3.idealista.com/blur/WEB_DETAIL-L-L/0/id.pro.es.image.master/39/9e/07/1094836702.jpg",
      "https://img3.idealista.com/blur/WEB_DETAIL-L-L/0/id.pro.es.image.master/10/b7/11/1094836733.jpg",
      "https://img3.idealista.com/blur/WEB_DETAIL-L-L/0/id.pro.es.image.master/9b/df/fa/1094836735.jpg",
      "https://img3.idealista.com/blur/WEB_DETAIL-L-L/0/id.pro.es.image.master/10/35/8b/1094836690.jpg",
      "https://img3.idealista.com/blur/WEB_DETAIL-L-L/0/id.pro.es.image.master/7e/6e/7b/1094836691.jpg",
      "https://images.unsplash.com/photo-1526512340740-9217d0159da9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
    ],
  };

  return (
    <FlatterPage withBackground userLogged>
      <div className="housing-page">
        <section className="housing">
          <div className="housing__photo">
            <div className="photo-container">
              <SlideShow images={piso.images} />
            </div>
          </div>
          <div className="housing__info">
            <div className="title">
              <h1>{piso.name}</h1>
              <span>ID: {piso.id}</span>
            </div>
            <div className="price">
              <span>{piso.price}€/mes</span>
            </div>
            <div className="description">
              <h3>Descripción</h3>
              <p>{piso.description}</p>
            </div>
            <div className="tags-row">
              <Tag name="Prueba" color="#000000"/>
              <Tag name="Pruebaasdasdas" color="#000000"/>
              <Tag name="Pra" color="#000000"/>
              <Tag name="Pruasdasdeba" color="#000000"/>
              <Tag name="Pru" color="#000000"/>
              <Tag name="Prusadeba" color="#000000"/>
              <Tag name="Prue" color="#000000"/>
              <Tag name="Pa" color="#000000"/>      
            </div>
            <div className="btn__container">
              <button className="btn">
                <img
                  src={require("../static/files/icons/chat-icon.png")}
                  alt="chat icon"
                />
                CONTACTAR
              </button>
            </div>
          </div>
        </section>
        <section className="people">
          <section className="flatmates">
            <div className="container__title">
              <img
                src={require("../static/files/icons/usuario.png")}
                alt="user icon"
              />
              <h1>Compañeros</h1>
            </div>
            <div className="flatmates__container">
              {piso.flatmates.map((user, index) => (
                <SmallProfile key={index} user={user} />
              ))}
            </div>
          </section>
          <section className="owner">
            <div className="container__title">
              <img
                src={require("../static/files/icons/estrella.png")}
                alt="star icon"
              />
              <h1>Propietario</h1>
            </div>
            <SmallProfile user={piso.owner} />
          </section>
        </section>
      </div>
    </FlatterPage>
  );
};

export default PropertyDetails;