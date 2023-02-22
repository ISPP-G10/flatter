import '../static/css/landingPage.css';
import Header from "./header"
import Footer from "./footer"

import { useEffect, useState } from "react";

const ScrollingPage = (props) => {

    let [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        document.addEventListener("scroll", (e) => {

            setScrollY(window.scrollY);
        });
    });

    return(
        <main>
            <Header scrollY={scrollY} />

            <div className="site-content">
                {props.children}
            </div>

            <Footer />
        </main>
    );
}

export default ScrollingPage;