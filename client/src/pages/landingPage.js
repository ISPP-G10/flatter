import "../static/css/landingPage.css";
import ZoomingImages from "../components/imagesZoom";

const LandingPage = () => {

    const imageSet = [
        require("../static/files/images/sample-1.jpg"),
        require("../static/files/images/sample-2.jpg"),
        require("../static/files/images/sample-3.jpg"),
        require("../static/files/images/sample-4.jpg"),
    ];

    return(
        <> 
        <ZoomingImages imageSet={imageSet} marginTop={300}/>
        </>
    );
}

export default LandingPage;