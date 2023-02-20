import Hero from '../sections/hero';

import SolidButton from '../sections/solidButton';

const HeroHome = () => {

    return (
        <Hero height={100} background="hero-home-background.jpg" class="home">
            <div className="hero-home">
                <h1 className="hero-title">¿List@ para conocer a los nuevos integrantes de tu piso?</h1>
                
                <p className="hero-subtitle">Basta ya de falta de compromiso o problemas compartiendo piso.</p>

                <div className="hero-content glass">
                    <p>Bienvenido a Flatter, donde desde el primer minuto podrás conocer los perfiles de tus futuros compañeros y casero. Conoce sus gustos, y contacta con ellos.</p>
                    <p>Y lo mejor, totalmente gratis.</p>

                    <div class="hero-content-bottom">
                        <p>¿Quiéres más información?</p>

                        <div class="button-group">
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