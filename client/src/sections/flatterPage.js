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

  function navigateToAdLeft(){

    if (window.innerWidth > 1300){
      window.open("https://mcdonalds.es/", "_blank");
    }else{
      window.open("https://www.bmw.com/", "_blank");
    }
  }

  function navigateToAdRight(){
    window.open("https://www.ikea.es/", "_blank");
  }

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
              <div className="ad ad-izq" onClick={navigateToAdLeft}></div>
              <div className="ad ad-der" onClick={navigateToAdRight}></div>
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
  withAds: true,
};

export default FlatterPage;
