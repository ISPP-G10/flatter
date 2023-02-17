import '../static/css/images-zoom.css';
import { useEffect, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimesions";

const ZoomingImages = ({imageSet}) => {

    let [spiralPoints, setSpiralPoints] = useState([]);

    const { height, width } = useWindowDimensions();

    const THETAS = [
        7*Math.PI/4,
        3*Math.PI/4,
        Math.PI/4,
        5*Math.PI/4,
        0,
        Math.PI,
        Math.PI/2,
        3*Math.PI/2,
    ];

    function generateSpritalPoints(){

        let spiralPoints = [];  
        let directionVectors = []
        let modules = [];
        let numberOfPictures = imageSet.length;
    
        if(numberOfPictures > 8){
            let directionVectorsGenerationCounter = 0;
            for(let i=0; i<numberOfPictures; i++){
                directionVectors.push(THETAS[directionVectorsGenerationCounter]);
                directionVectorsGenerationCounter++;
                if(directionVectorsGenerationCounter === 8){
                    directionVectorsGenerationCounter = 0;
                }
            }
        }else{
            directionVectors = THETAS;
        }

        for(let i=1; i<=numberOfPictures; i++){
            modules.push((200/i)+100);
        }
    
        for(let i=0; i<numberOfPictures; i++){
            let x = modules[i]*Math.cos(directionVectors[i]);
            let y = modules[i]*Math.sin(directionVectors[i]);
            spiralPoints.push({x: x, y: y});
        }

        return spiralPoints;
    
    }

    useEffect(() => {

        setSpiralPoints(generateSpritalPoints());

        document.addEventListener("scroll", (e) => {
            let value = window.scrollY
            let zoomingImages = document.querySelectorAll(".zooming-image");

            zoomingImages.forEach((image, index) => {

                let splittedTransform = image.style.transform.split(" ");

                let previousPerspective = splittedTransform[0];
                let previousXTransform = splittedTransform[1];
                let previousYTransform = splittedTransform[2];

                image.style.transform = `${previousPerspective} ${previousXTransform} ${previousYTransform} translateZ(${value}px)`;
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className="component-wrapper">
            <div className="zooming-images-container" style={{height: `${(imageSet.length)*750+height*2}px`, marginTop: '300px'}}>
            {
                (spiralPoints.length > 0 && imageSet) && imageSet.map((image, index) => {

                    let imageStyle = {
                        maxHeight: `${250/(index+1)+125}px`,
                        maxWidth: `${250/(index+1)+125}px`,
                        transform: `perspective(${((index+1)*750)+1000}px) translateX(${spiralPoints[index].x}px) translateY(${spiralPoints[index].y}px)`,
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