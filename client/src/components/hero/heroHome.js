import Hero from '../../sections/hero';
import SolidButton from '../../sections/solidButton';

const HeroHome = ({pilotUsersModal}) => {

    return (
        <Hero height={100} horizontalBackground="hero-home-background.jpg" verticalBackground="hero-home-vertical-bg.jpg" className="home">
            <div className="hero-home">
                <h1 className="hero-title">¿List@ para conocer a los nuevos integrantes de tu piso?</h1>
                
                <p className="hero-subtitle"></p>

                <div className="hero-content glass">
                    <p className='hero-glass-text'>Te damos la bienvenida a <span style={{color: 'var(--flatter-blue-color)'}}>Flatter</span>, una plataforma donde, además de buscar viviendas para alquilar, podrás conocer los perfiles de tus futuros compañeros y propietario antes de tomar una decisión. Conoce sus gustos, y contacta con ellos.</p>
                    <p className='hero-glass-text' style={{marginTop: '30px'}}>Y lo mejor, ¡sin gastos adicionales!</p>

                    <div className="hero-content-bottom">
                        <p className='hero-glass-text' style={{marginBottom: '20px'}}>¿Quiéres más información?</p>

                        <div className="button-group">
                            <SolidButton text="Únete como propietario" type="featured" onClick = {() => {
                                pilotUsersModal.current.open();
                                setTimeout(()=>{
                                    let isInquilino = document.querySelectorAll('.switch-toggle.switch-toggle--orange').length>0;

                                    if(isInquilino) {
                                        document.querySelector('.switch').click();
                                    }
                                }, 300)
                                
                            }}/>
                            <SolidButton text="Únete como inquilino" type="featured" onClick = {() => {
                                pilotUsersModal.current.open();
                                setTimeout(()=>{
                                    
                                    let isInquilino = document.querySelectorAll('.switch-toggle.switch-toggle--orange').length>0;

                                    if(!isInquilino) {
                                        document.querySelector('.switch').click();
                                    }
                                }, 300)
                                
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </Hero>
    );
}

export default HeroHome;