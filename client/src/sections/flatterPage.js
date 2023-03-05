import Header from "./header"
import Footer from "./footer"

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FlatterPage = (props) => {

    const navigate = useNavigate();

    let [scrollY, setScrollY] = useState(0);
    let [user, setUser] = useState(null);
    let [token, setToken] = useState(null);

    useEffect(() => {

        if(props.userLogged){
            localStorage.getItem("user") ? setUser(localStorage.getItem("user")) : navigate("/");
            localStorage.getItem("token") ? setToken(localStorage.getItem("token")) : setToken("");
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        document.addEventListener("scroll", (e) => {
            setScrollY(window.scrollY);
        });
    });

    return(
        <main>

            {
                user ?
                <Header scrollY={props.withBackground ? 100 : scrollY} user={user} token={token}/>
                :
                <Header scrollY={props.withBackground ? 100 : scrollY} />
            }

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
    withBackground: PropTypes.bool,
    userLogged: PropTypes.bool
}

FlatterPage.defaultProps = {
    withBackground: false,
    userLogged: false
}

export default FlatterPage;