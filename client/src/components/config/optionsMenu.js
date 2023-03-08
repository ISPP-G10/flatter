const OptionMenu = () => {
    return(
        <div className="options">
            <div><p style={{fontWeight:'bold', fontSize: '25px', color: '#005f8f', marginLeft: '8px', paddingBottom:'15px'
            , paddingTop:'15px'}}>
                Opciones</p></div>
            <div className="opt">
                <a href="/config/account" style={{marginLeft: '5px', marginRight:'5px', height:'20px', textDecorationLine:'none', color: 'black'}}>
                    <img src={require('../../static/files/icons/usuario.png')} style={{marginLeft: '5px', marginRight:'5px', height:'20px'}}></img>
                    Mi cuenta
                </a>
            </div>
            <div className="opt"  style={{backgroundColor: '#00aaff97'}}>
                <a href="/config/changePassword" style={{marginLeft: '5px', marginRight:'5px', height:'20px', textDecorationLine:'none', color:'black'}}>
                    <img src={require('../../static/files/icons/candado.png')} style={{marginLeft: '5px', marginRight:'5px', height:'20px'}}></img>
                    Cambiar contraseña
                </a>
            </div>
        </div>
    );
}

export default OptionMenu;