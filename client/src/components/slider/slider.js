import React, {useState} from 'react'
import '../../static/css/components/Slider.css'
import BtnSlider from './btnSlider'

export default function Slider() {

    const [slideIndex, setSlideIndex] = useState(1)

    const nextSlide = () => {
        if(slideIndex !== dataSlider.length){
            setSlideIndex(slideIndex + 1)
        } 
        else if (slideIndex === dataSlider.length){
            setSlideIndex(1)
        }
    }

    const prevSlide = () => {
        if(slideIndex !== 1){
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1){
            setSlideIndex(dataSlider.length)
        }
    }

    const moveDot = index => {
        setSlideIndex(index)
    }

    const dataSlider = [
        {
          id: 1,
          title: "Lorem ipsum",
          subTitle: "Lorem",
        },
        {
          id: 2,
          title: "Lorem ipsum",
          subTitle: "Lorem",
        },
        {
          id: 3,
          title: "Lorem ipsum",
          subTitle: "Lorem",
        },
        {
          id: 4,
          title: "Lorem ipsum",
          subTitle: "Lorem",
        },
        {
          id: 5,
          title: "Lorem ipsum",
          subTitle: "Lorem",
        },
      ];

    return (
        <div className="container-slider">
            {dataSlider.map((obj, index) => {
                return (
                    <div
                    key={obj.id}
                    className={slideIndex === index + 1 ? "slide active-anim" : "slide"}
                    >
                        <img 
                        src={require(`../../static/files/images/sample-${index + 1}.jpg`)} 
                        alt="Imagen de piso"
                        />
                    </div>
                    
                )
            })}
            <BtnSlider moveSlide={nextSlide} direction={"next"} />
            <BtnSlider moveSlide={prevSlide} direction={"prev"}/>

            <div className="container-dots">
                {Array.from({length: 5}).map((item, index) => (
                    <div 
                    onClick={() => moveDot(index + 1)}
                    className={slideIndex === index + 1 ? "dot active" : "dot"}
                    ></div>
                ))}
            </div>
        </div>
    )
}
