import '../static/css/images-zoom.css';
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "../hooks/useWindowDimesions";

const ZoomingImages = ({imageSet, marginTop}) => {

    let [spiralPoints, setSpiralPoints] = useState([]);

    const {height, width} = useWindowDimensions();

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

    let container = useRef(null);
    let containerImages = useRef([]);
    
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

            if(height>=width){
                var value = window.scrollY - container.current.offsetTop + height/2.5;
            }else{
                let value = window.scrollY - container.current.offsetTop + height/5.4;
            }

            containerImages.current.forEach((image) => {

                let newTransformValue = `${image.style.transform.substring(0, image.style.transform.lastIndexOf(","))}, 0px)`;

                if(value > 0){
                    image.style.top = `50%`;
                    image.style.position = "fixed";
                    newTransformValue = `${image.style.transform.substring(0, image.style.transform.lastIndexOf(","))}, ${value}px)`;
                }else{
                    image.style.top = `0%`;
                    image.style.position = "absolute";
                }
                image.style.transform = newTransformValue;
                
            });

        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerImages])

    return(
        <div className="component-wrapper" ref={container}>
            <div className="zooming-images-container" style={{height: `${(imageSet.length)*750+height*2}px`, marginTop: `${marginTop}px`}}>
            {
                (spiralPoints.length > 0 && imageSet) && imageSet.map((image, index) => {

                    let imageStyle = {
                        maxHeight: `${250/(index+1)+125}px`,
                        maxWidth: `${250/(index+1)+125}px`,
                        transform: `perspective(${((index+1)*750)+1000}px) translate3d(${spiralPoints[index].x}px, ${spiralPoints[index].y}px, 0px)`,
                        zIndex: `${10000-index}`
                    }

                    return(
                        
                        <img ref={(image) => (containerImages.current[index] = image)} src={image} alt="sample" className={'zooming-image'} style={imageStyle} key={`zooming-image-${index}`}/>
                        
                    )
                })
            }
            </div>
        </div>
    );
}

ZoomingImages.propTypes = {
    imageSet: PropTypes.array,
    marginTop: PropTypes.number
}

ZoomingImages.defaultProps = {
    imageSet: [],
    marginTop: 300
}

export default ZoomingImages;