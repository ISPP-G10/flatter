import "../static/css/landingPage.css";
import ZoomingImages from "../components/imagesZoom";

const LandingPage = () => {

    const imageSet = [
        require("../static/files/images/sample-1.jpg"),
        require("../static/files/images/sample-2.jpg"),
        require("../static/files/images/sample-3.jpg"),
        require("../static/files/images/sample-4.jpg"),
        require("../static/files/images/sample-5.jpg"),
        require("../static/files/images/sample-6.jpg"),
        require("../static/files/images/sample-7.jpg"),
        require("../static/files/images/sample-8.jpg"),
        require("../static/files/images/sample-9.jpg"),
        require("../static/files/images/sample-10.jpg"),
    ];

    return(
        <> 
        -------------------------------------------------- INICIO --------------------------------------------------
        <ZoomingImages imageSet={imageSet}/>
        -------------------------------------------------- FIN --------------------------------------------------
        </>
    );
}

export default LandingPage;