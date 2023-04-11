import Header from "./header";
import Footer from "./footer";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import usersAPI from "../api/usersAPI";

const FlatterPage = (props) => {
  let [scrollY, setScrollY] = useState(0);

  const { data, loading } = useQuery(usersAPI.getContractByUsername, {
    variables: {
      username: localStorage.getItem("user", ""),
    },
  });

  useEffect(() => {
    document.addEventListener("scroll", (e) => {
      setScrollY(window.scrollY);
    });
  });

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <Header
        scrollY={props.withBackground ? 100 : scrollY}
        userLogged={props.userLogged}
      />

      {props.withBackground ? (
        <div className="site-content">
          {props.withAds && data.getContractByUsername.plan.planType === "B" ? (
            <>
              <div className="ad ad-izq">
                <img src="https://th.bing.com/th/id/R.235c4bae8aeaaf6ec8f16002c005c349?rik=EV6p3K7faGVHzQ&pid=ImgRaw&r=0" alt="etsii us" />
                <p>Aprueban a todos los alumnos de ISPP</p>
                <a href="https://ev.us.es">Leer más</a>
              </div>
              <div className="ad ad-der">
                <img src="https://th.bing.com/th/id/OIP.dRyxyidVi-zBEvAvz6f9lAHaFj?pid=ImgDet&rs=1" alt="metro sevilla" />
                <p>¡Nueva línea de metro en Sevilla!</p>
                <a href="https://www.sevilla.org/">¡Visítanos!</a>
              </div>
            </>
          ) : (
            <></>
          )}
          {props.children}
          {/* <!-- Bloque de anuncio --> */}
          {/* <ins
            class="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-6905477686127235"
            data-ad-slot="1693534006"
            data-ad-format="auto"
            data-adtest="on"
            data-full-width-responsive="true"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
          <Footer />
        </div>
      ) : (
        <>
          <div>
            {props.children}
            {/* <!-- Bloque de anuncio --> */}
            {/* <ins
              class="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-6905477686127235"
              data-ad-slot="1693534006"
              data-ad-format="auto"
              data-adtest="on"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
          </div>

          <Footer />
        </>
      )}
    </main>
  );
};

FlatterPage.propTypes = {
  withBackground: PropTypes.bool,
  withAds: PropTypes.bool,
};

FlatterPage.defaultProps = {
  withBackground: false,
  withAds: false,
};

export default FlatterPage;
