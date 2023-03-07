import Header from "./header"
import Footer from "./footer"

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
            <Header scrollY={props.withBackground ? 100 : scrollY} />

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

export default FlatterPage;