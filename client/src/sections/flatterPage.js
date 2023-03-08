import Header from "./header"
import Footer from "./footer"

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const FlatterPage = (props) => {

    let [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        document.addEventListener("scroll", (e) => {
            setScrollY(window.scrollY);
        });
    });

    return(
        <main>

            <Header scrollY={props.withBackground ? 100 : scrollY} userLogged={props.userLogged}/>

            {
                props.withBackground ? 
                (
                    <div className="site-content">
                        {props.children}
                        <Footer />
                    </div>    
                )
                :
                (
                    <>
                        <div>
                            {props.children}
                        </div>

                        <Footer />
                    </>
                )
            }
        </main>
    );
}

FlatterPage.propTypes = {
    withBackground: PropTypes.bool
}

FlatterPage.defaultProps = {
    withBackground: false
}

export default FlatterPage;