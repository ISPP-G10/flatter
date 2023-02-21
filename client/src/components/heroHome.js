import Hero from '../sections/hero';
import SolidButton from '../sections/solidButton';

const HeroHome = () => {

    return (
        <Hero height={100} horizontalBackground="hero-home-background.jpg" verticalBackground="hero-home-vertical-bg.jpg" class="home">
            <div className="hero-home">
                <h1 className="hero-title">¿List@ para conocer a los nuevos integrantes de tu piso?</h1>
                
                <p className="hero-subtitle">Basta ya de falta de compromiso o problemas compartiendo piso.</p>

                <div className="hero-content glass">
                    <p className='hero-glass-text'>Bienvenido a Flatter, donde desde el primer minuto podrás conocer los perfiles de tus futuros compañeros y casero. Conoce sus gustos, y contacta con ellos.</p>
                    <p className='hero-glass-text'>Y lo mejor, totalmente gratis.</p>

                    <div className="hero-content-bottom">
                        <p className='hero-glass-text'>¿Quiéres más información?</p>

                        <div className="button-group">
                            <SolidButton text="Quiero listar mi inmueble" type="invertedOutlined" />
                            <SolidButton text="Buscar compañeros de piso" type="invertedOutlined" />
                        </div>
                    </div>
                </div>
            </div>
        </Hero>
    );
}

export default HeroHome;