import '../../static/css/components/carousel.css'

import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as settings from '../../settings';

const MainPageCarousel = ({items}) => {

    const navigator = useNavigate();

    let [carouselItems, setCarouselItems] = useState([...items])

    let carouselContainer = useRef(null);
    let statusBar = useRef(null);
    let carouselItemsRef = useRef([]);

    function updateCarousel(){
        carouselItemsRef.current.forEach((item, index) => {
            let itemId = parseInt(item.id)-1;
            for(let i = 0; i <= carouselItemsRef.current.length; i++){
                statusBar.current.childNodes[itemId].style.backgroundColor = '#8e8e8e';
                item.classList.remove(`carousel-item-${i+1}`);
            }
            item.classList.add(`carousel-item-${index+1}`);
            if(item.className.includes('carousel-item-3')){
                statusBar.current.childNodes[itemId].style.backgroundColor = 'var(--flatter-orange-color)';
            }
        });
    }

    function setCurrentState(direction){
        if(direction === 'previous'){
            let extra = carouselItemsRef.current.pop();
            carouselItemsRef.current.unshift(extra);
        }else{
            let extra = carouselItemsRef.current.shift();
            carouselItemsRef.current.push(extra);
        }

        updateCarousel();
    }

    useEffect(() => {
        if(carouselItems.length === 5){
            statusBar.current.childNodes[2].style.backgroundColor = 'var(--flatter-orange-color)';
            setInterval(() => {
                setCurrentState('next');
            }, 4000);
        }else if(carouselItems.length < 5){
            for(let i = carouselItems.length; i < 5; i++){
                carouselItems.push(null);
            }
            setCarouselItems([...carouselItems]);
        }else{
            setCarouselItems([...carouselItems].slice(0, 5));
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carouselItems]);

    return (
        <div className="carousel">
            <div className="carousel-status-bar" ref={statusBar}>
                {
                    [...Array(5).keys()].map((_, index) => {
                        return(
                            <div className="carousel-status-bar-item" key={`status-${index+1}`}></div>
                        );
                    })
                }
            </div>
            <div className="carousel-container" ref={carouselContainer}>
                {
                    carouselItems.length === 5 && carouselItems.map((item, index) => {
                        return (
                            <div    className={`carousel-item carousel-item-${index+1}`} 
                                    id={`${index+1}`} 
                                    key={index} 
                                    ref={(image) => (carouselItemsRef.current[index] = image)} 
                                    onClick={() => navigator(`/property/${item.id}`)}
                                    style={{cursor: item === null ? 'default' : 'pointer'}}
                                    >
                                <div className="carousel-item-content">
                                    {
                                        item === null ?
                                            <img src={require('../../static/files/images/carousel-marketing.jpg')} alt={`Item ${index+1}`}/>
                                        :
                                            <>
                                                <img src={settings.API_SERVER_MEDIA + item.images[0].image} alt={`Item ${index+1}`}/>
                                                <div className='carousel-item-owner'>
                                                    <img src={ settings.API_SERVER_MEDIA + item.owner.profilePicture} alt={`Foto perfil ${item.owner.firstName} ${item.owner.lastName}`}></img>
                                                    <span>{item.owner.firstName} {item.owner.lastName}</span>
                                                </div>
                                            </>
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default MainPageCarousel;