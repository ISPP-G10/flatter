import { Link } from 'react-router-dom';
import '../static/css/components/publicProfileCard.css'

const PublicProfileCard = () => {

    return (
        <div className='containerFlex'>
            <div style={{marginLeft: '2%'}}>
                <h2>Lucía Martín</h2>
                <p>Estudiante en universidad de Sevilla</p>
                <p>24 años</p>
                <img className='photo' src={require('../static/files/images/foto.jpg')} alt='Profile Photo'/>    
            </div>
            <div className='biografia'>
                <h2 style={{textAlign: 'left'}}>Yo...</h2>
                <br/>
                <p id='text'>Soy estudiante d bikb wincwnc pwncc ncffwoeifjnwepvinvobsw siovhwsvnboisv as csno cvsn vsdn vdwfobeofbwoi fbsofibesf ejfbiubf
                    fwoufcbwof bfuosbfes fubwsfc oibsoifcbeaebf coeiebfcbeacoiabfcff eaofcbaic eoice acoifbac aoichba coeiebfcbeacoiabfcffncf
                    nsoibncvsc nasibocas coiab caiocba cobascv ao voisbn asj. 
                    bloabicalciabcisnbvsiobvosv ajbvsoibvoiusvjs vkjsbvbs vkjbsv soiv hbasbvioasbavoisbvusbvc skjvb. jBCAOIUABWCOIUA CJUABCAB caiocbaCAOICN BASBCA
                     CJSCBAOCAS JBOS CSUBVSD VVDUSBV DSVUSIB
                </p>
                <br/>
                <div className='etiquetas' style={{textAlign: 'center'}}>
                    <span id='etiqueta'>LGTBI</span>
                    <span id='etiqueta'>LOL</span>
                </div>
            </div>           
        </div>
    );
}

export default PublicProfileCard;