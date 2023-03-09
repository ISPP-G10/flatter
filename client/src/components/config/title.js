const TitleConfig = (props) => {
    return(
        <div id="configBody">
            <div className="title">CONFIGURACIÓN DE FLATTER</div>
            <div id="menu">
                {props.children}
            </div>
        </div>
    )
}

export default TitleConfig;