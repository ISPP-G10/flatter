import { Link } from "react-router-dom";
import customAlert from "../../libs/functions/customAlert";
import socialLib from "../../libs/socialLib";
import "../../static/css/components/benefitsSetting.css"


const BenefitsSetting = (props) => {

    const copyShareInputClipboard = () => {
        const input = document.querySelector('#share-code-input');
        window.navigator.clipboard.writeText(input.value)
          .then(customAlert("¡Ya puedes compartir tu código!", 'success'))
          .catch(error => customAlert('Ha ocurrido un error', 'error'));;
    }

    return(
        <>
            <h2 className='section-title'>Mis beneficios</h2>
            <p className="benefits-text">En esta sección puedes ver tus ventajas y promociones especiales por estar registrado en Flatter. Para canjear descuentos y códigos promocionales utiliza el apartado correspondiente en la sección <Link to="/shop">Tienda</Link>.</p>
            <h3 className='section-title'>Programa de referidos</h3>
            <p className="share-code-text">Haz que tus amigos usen este código al crearse una cuenta y gana {props.quantity===1 ? props.quantity + ' FlatterCoin':props.quantity + ' FlatterCoins'} cada vez que se unan. Te {props.invitations!==1? 'queda ' + props.invitations + ' pendientes':'quedan ' + props.invitations + ' pendiente'} y tienes hasta el próximo {socialLib.getDateToString(props.endDate)} para conseguirlo.</p>
            <div className="share-code mt-4">
                <input id="share-code-input" type="text" value={props.code} placeholder="Código de referidos" readOnly={ true } />
                <button className="share-code-btn" title="Copia el código" onClick={ function(e) {
                
                    copyShareInputClipboard();

                    } 
                }></button>
                <button className="share-code-whatsapp" title="Comparte el código por WhatsApp" onClick={ () => {
                    const text = `¡Hola! Usa mi código ${props.code} al registrarte en https://${window.location.host}. Hazlo ahora y recibirás ${props.referralQuantity} FlatterCoins de bienvenida.`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURI(text)}`, "_blank");
                    } }></button>
            </div>
        </>
    )
}

export default BenefitsSetting;