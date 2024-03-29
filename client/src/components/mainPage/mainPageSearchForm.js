import {useEffect, useState, useRef} from 'react';

import MultiRangeSlider from '../inputs/multiRangeSlider';
import { useNavigate } from 'react-router-dom';

const MainPageSearchForm = () => {

    const navigate = useNavigate();

    let minPosiblePrice = 0;
    let maxPosiblePrice = 2000;

    let [currentForm, setCurrentForm] = useState('properties');
    let [city, setCity] = useState('');
    let [userTag, setUserTag] = useState('');
    let [ownerTag, setOwnerTag] = useState('');
    let [minPrice, setMinPrice] = useState(minPosiblePrice);
    let [maxPrice, setMaxPrice] = useState(maxPosiblePrice);
    let [minPartnerScore, setMinPartnerScore] = useState(1);
    let [maxPartnerScore, setMaxPartnerScore] = useState(5);
    let [minOwnerScore, setMinOwnerScore] = useState(1);
    let [maxOwnerScore, setMaxOwnerScore] = useState(5);

    let propertiesForm = useRef(null);
    let partnersForm = useRef(null);
    let ownersForm = useRef(null);
    let propertiesClickTracker = useRef(null);
    let partnersClickTracker = useRef(null);
    let ownersClickTracker = useRef(null);

    const resetZIndex = () => {
        propertiesForm.current.style.zIndex = 1;
        partnersForm.current.style.zIndex = 1;
        ownersForm.current.style.zIndex = 1;
    }

    function performSearch(){
        if(currentForm === 'properties'){
            navigate(`/search?min=${minPrice}&max=${maxPrice}&municipality=${city}`);
        }else if(currentForm === 'partners'){
            navigate(`/users?min=${minPartnerScore}&max=${maxPartnerScore}&tag=${userTag}&owner=false`);
        }else{
            navigate(`/users?min=${minOwnerScore}&max=${maxOwnerScore}&tag=${ownerTag}&owner=true`);
        }
    }

    useEffect(()=>{

        propertiesClickTracker.current.addEventListener('click', ()=>{
            resetZIndex();
            setCurrentForm('properties');
        });

        partnersClickTracker.current.addEventListener('click', ()=>{
            resetZIndex();
            setCurrentForm('partners');
        });

        ownersClickTracker.current.addEventListener('click', ()=>{
            resetZIndex();
            setCurrentForm('owners');
        });

    }, [])

    useEffect(()=>{

        switch(currentForm){
            case 'properties':
                propertiesForm.current.style.zIndex = 3;
                break;
            case 'partners':
                partnersForm.current.style.zIndex = 3;
                break;
            case 'owners':
                ownersForm.current.style.zIndex = 3;
                break;
            default:
                resetZIndex();
        }

    }, [currentForm])

    return (
        <>
            <div className="container-wrapper">

                <div className="properties-click-tracker" ref={propertiesClickTracker}>
                    <span className='tracker-text'><img src={require('../../static/files/icons/properties-icon.png')} alt="Icono propiedades"/></span>
                </div>
                <div className="partners-click-tracker" ref={partnersClickTracker}>
                    <span className='tracker-text'><img src={require('../../static/files/icons/partners-icon.png')} alt="Icono compañeros"/></span>
                </div>
                <div className="owners-click-tracker" ref={ownersClickTracker}>
                    <span className='tracker-text'><img src={require('../../static/files/icons/owners-icon.png')} alt="Icono propietarios"/></span>
                </div>

                <div className="properties-form-container" ref={propertiesForm}>
                    <div className="properties-form-container-bg-section-1"></div>
                    <div className="properties-form-container-bg-section-2"></div>
                    <form id="properties-form">
                        <input className="main-page-input" type="text" name="city-filter" id="city-filter" placeholder='Municipio' onChange={(e) => setCity(e.target.value)}/>
                        <div className="range-input-container">
                            <p>Precio (€)</p>
                            <MultiRangeSlider
                                min={minPosiblePrice}
                                max={maxPosiblePrice}
                                onChange={({min, max})=>{
                                    setMinPrice(min);
                                    setMaxPrice(max);
                                }}
                                sliderTrackColor='var(--flatter-orange-color)'
                            />
                        </div>
                    </form>
                </div>
                <div className="partners-form-container" ref={partnersForm}>
                    <div className="partners-form-container-bg-section-1"></div>
                    <div className="partners-form-container-bg-section-2"></div>
                    <form id="partners-form">
                        <input className="main-page-input" type="text" name="partners-tag-filter" id="partners-tag-filter" placeholder='Etiqueta' onChange={(e) => setUserTag(e.target.value)}/>
                        <div className="range-input-container">
                            <p>Puntuación</p>
                            <MultiRangeSlider
                                min={1}
                                max={5}
                                onChange={({min, max})=>{
                                    setMinPartnerScore(min);
                                    setMaxPartnerScore(max);
                                }}
                                sliderTrackColor='var(--flatter-orange-color)'
                            />
                        </div>
                    </form>
                </div>
                <div className="owners-form-container" ref={ownersForm}>
                    <div className="owners-form-container-bg-section-1"></div>
                    <div className="owners-form-container-bg-section-2"></div>
                    <div className="owners-form-container-bg-section-3"></div>
                    <form id="owners-form">
                        <input className="main-page-input" type="text" name="partners-tag-filter" id="partners-tag-filter" placeholder='Etiqueta' onChange={(e) => setOwnerTag(e.target.value)} />
                        <div className="range-input-container">
                            <p>Puntuación</p>
                            <MultiRangeSlider
                                min={1}
                                max={5}
                                onChange={({min, max})=>{
                                    setMinOwnerScore(min);
                                    setMaxOwnerScore(max);
                                }}
                                sliderTrackColor='var(--flatter-orange-color)'
                            />
                        </div>
                    </form>
                </div>
                <div className="main-page-submit-button-row">
                    <div className="main-page-submit-button" onClick={performSearch}>
                        <span style={{display: 'flex', alignItems: 'center'}}>
                            BUSCAR OFERTAS
                            <img 
                                height={25} 
                                width={25} 
                                src={require('../../static/files/icons/lupa.png')} 
                                style={{marginLeft: '20px'}}
                                alt="lupa"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainPageSearchForm;