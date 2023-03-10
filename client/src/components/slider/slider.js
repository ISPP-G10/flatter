import '../../static/css/components/slider-style.css'

import React, {useState} from 'react'
import BtnSlider from './btnSlider'
import * as settings from '../../settings'

export default function Slider({images}) {

    const [slideIndex, setSlideIndex] = useState(1)

    const nextSlide = () => {
        if(slideIndex !== images.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === images.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(images.length)
        }
    }

    return (
        <div className="container-slider">
            {images.map((image, index) => {
                return (
                    <div
                    key={ index }
                    className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
                    >
                        <img 
                        src={ settings.API_SERVER_MEDIA + image} 
                        alt="Imagen de piso"
                        />
                    </div>
                    
                )
            })}
            {
                images.length > 1 &&(
                    <>
                        <BtnSlider moveSlide={nextSlide} direction={"next"} />
                        <BtnSlider moveSlide={prevSlide} direction={"prev"}/>
                    </>
                )
            }
        </div>
    )
}
