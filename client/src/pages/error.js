import '../static/css/error.css'
import { useRef, useEffect } from "react";

const Error = () => {

    let mainContainer = useRef();

    useEffect(() => {
        mainContainer.current.classList.add("main-container");
        mainContainer.current.classList.add("error-message-active");
    }, [])

    return(
        <>
            <div className="main-container" ref={mainContainer}>
                <div className="error-message">
                    <h1>Ups...</h1>  
                    <p>La página que buscas no es nuestra</p>
                </div>
                <div className="aura-1"></div>
                <div className="aura-2"></div>
            </div>
        </>
    );
} 

export default Error;