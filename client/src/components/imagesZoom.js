import '../static/css/images-zoom.css';
import { useEffect, useState } from "react";

const ZoomingImages = () => {

    let [spiralPoints, setSpiralPoints] = useState([]);

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

    useEffect(() => {

        let points = [];
        const a = 10;
        const b = 10;
        const k = 8;

        for(let i=0; i<imageSet.length; i++){
            let theta =  i*Math.PI/4;
            let r = a + b * Math.cos(k*theta)
            let x = r*Math.cos(theta);
            let y = r*Math.sin(theta);
            points.push({x,y});
        }

        setSpiralPoints(points);

        document.addEventListener("scroll", (e) => {
            let value = window.scrollY
            let zoomingImages = document.querySelectorAll(".zooming-image");

            zoomingImages.forEach((image, index) => {

                let previousPerspective = image.style.transform.split(" ")[0];
                let previousXTransform = image.style.transform.split(" ")[1];

                image.style.transform = `${previousPerspective} ${previousXTransform} translateZ(${value}px)`;
            });
        });
    }, [])

    return(
        <div className="component-wrapper">
            <div className="zooming-images-container" style={{height: `${(imageSet.length-2)*1000}px`}}>
            {
                (spiralPoints.length > 0 && imageSet) && imageSet.map((image, index) => {

                    let imageStyle = {
                        top: `${(10*spiralPoints[index].y) + 300}px`,
                        height: `${((imageSet.length+3)*30)/(index+1)}px`,
                        width: `${((imageSet.length+3)*30)/(index+1)}px`,
                        transform: `perspective(${((index+1)*500)+1000}px) translateX(${10*spiralPoints[index].x}px)`,
                        zIndex: `${10000-index}`
                    }

                    return(
                        <img src={image} alt="sample" className="zooming-image" style={imageStyle} key={`zooming-image-${index}`}/>
                    )
                })
            }
            </div>
        </div>
    );
} 

export default ZoomingImages;