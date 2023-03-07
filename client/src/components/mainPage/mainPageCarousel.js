import '../../static/css/components/carousel.css'

import { useEffect, useRef } from "react";

const MainPageCarousel = ({items}) => {

    let carouselContainer = useRef(null);
    let statusBar = useRef(null);
    let carouselItems = useRef([]);

    function updateCarousel(){
        carouselItems.current.forEach((item, index) => {
            let itemId = parseInt(item.id)-1;
            for(let i = 0; i <= carouselItems.current.length; i++){
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
            let extra = carouselItems.current.pop();
            carouselItems.current.unshift(extra);
        }else{
            let extra = carouselItems.current.shift();
            carouselItems.current.push(extra);
        }

        updateCarousel();
    }

    useEffect(() => {
        statusBar.current.childNodes[2].style.backgroundColor = 'var(--flatter-orange-color)';
        setInterval(() => {
            setCurrentState('next');
        }, 4000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    items && items.map((item, index) => {
                        return (
                            <div className={`carousel-item carousel-item-${index+1}`} id={`${index+1}`} key={index} ref={(image) => (carouselItems.current[index] = image)}>
                                <div className="carousel-item-content">
                                    <img src={`${item.image}`} alt={`Item ${index+1}`}/>
                                    <div className='carousel-item-owner'>
                                        <img src={item.user.profilePicture} alt={`Foto perfil ${item.user.firstName} ${item.user.lastName}`}></img>
                                        <span>{item.user.firstName} {item.user.lastName}</span>
                                    </div>
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