import '../../static/css/components/options.css'

const OptionMenu= () => {
    return (
    <div className="options">
        <div>
            <p className='titleOptions'>
                Opciones
            </p>
        </div>
        <a className='aOptions' href="/me/account">
            <div className="opt" id='opt1'>
                <img className='imgOptions' src={require('../../static/files/icons/usuario.png')} alt="Icono usuario"></img>
                Mi cuenta
            </div>
        </a>
        <a className="aOptions" href="/me/changePassword">
            <div className="opt" id='opt2'>
                <img className="imgOptions" src={require('../../static/files/icons/candado.png')} alt="Icono contraseñas"></img>
                Cambiar contraseña
            </div>
        </a>
    </div>
    )
}

export default OptionMenu;