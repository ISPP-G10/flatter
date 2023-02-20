import { useEffect, useState } from "react";

const ToggleFeatures = () => {

    const [isToggled, setIsToggled] = useState(false);

    const toggled = 0;

    const scheme = [
        {
            image: require("../static/files/images/flatter-features.png"),
            title: 'Título del primer toggle',
            subtitle: 'Subtítulo'
        }
    ]

    const toggle = () => {
        toggled = (toggled+1)%2;
    }

    return (
        <div class="toggle-features">
        
            <div>

                <div>
                    { scheme.forEach((data, index) => {
                        return (<img key={`image_toggle_${index}`} src={data.image} />)
                    }) }
                </div>
                <div>
                    { scheme.forEach((data) => {
                        return (
                        <>
                            <h2>{data.title}</h2>
                            <p>{data.subtitle}</p>
                        </>);
                    }) }
                        
                    <div className="toggle">
                        <div className="toggle-card">
                            <div class="toggle-background"></div>
                            <div onClick="toggle">
                                Soy particular
                            </div>
                            <div onClick="toggle">
                                Soy propietario
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        

        </div>
    );

}

export default ToggleFeatures;