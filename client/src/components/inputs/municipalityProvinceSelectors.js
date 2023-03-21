import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import provincesApi from '../../api/provincesAPI';
import { useEffect, useRef, useState } from 'react';

const MunicipalityProvinceSelectors = (props) => {
 
    const provinceInput = useRef(null);
    const municipalityInput = useRef(null);
    const [provinceSelected, setProvinceSelected] = useState(props.defaultValue_province_input);
    const { data, loading } = useQuery(provincesApi.getAllProvincesAndMunicipes);
    const [ optionMunicipality, setOptionMunicipality ] = useState();

    function handleChange() {
        setProvinceSelected(provinceInput.current.value);
    }
    
    useEffect(() => { 
        if(provinceSelected != '' && !loading) {
            const selectedProvinceData = data.getProvincesMunicipalities.find(province => province.name === provinceSelected);
            setOptionMunicipality(selectedProvinceData.municipalitySet.map(municipality => municipality.name));
        }
    }, [data, provinceSelected]);
    
    if(loading) return <p>Loading...</p>
    const options = data.getProvincesMunicipalities.map(province => province.name);

    return (
        <>
            <div className={`class-form-group`} id={props.name_province_input+`_form`} style={props.numberOfColumns>1 ? {paddingTop: `2%`, width: `${100/props.numberOfColumns-3}%`} : {marginTop: `7.5%`}}>	
                <select className="class-form-input" id={props.name_province_input} name={props.name_province_input} required={props.isRequired_province_input} defaultValue={props.defaultValue_province_input} onChange={handleChange} ref={provinceInput}>
                    {
                        options && options.map((option, index) => {
                            return(
                                <option key={index}>{option}</option>
                            )
                        })
                    }
                </select>
                <label htmlFor={props.name} className="class-form-label" style={props.numberOfColumns>1 ? {paddingLeft: `1%`} : {}}>{props.tag_province_input}:</label>
            </div>
            <div className={`class-form-group`} id={props.name_municipality_input+`_form`} style={props.numberOfColumns>1 ? {paddingTop: `2%`, width: `${100/props.numberOfColumns-3}%`} : {marginTop: `7.5%`}}>	
                <select className="class-form-input" id={props.name_municipality_input} name={props.name_municipality_input} required={props.isRequired_municipality_input} defaultValue={props.defaultValue_municipality_input} ref={municipalityInput}>
                    {
                        optionMunicipality && optionMunicipality.map((option, index) => {
                            return(
                                <option key={index}>{option}</option>
                            )
                        })
                    }
                </select>
                <label htmlFor={props.name_municipality_input} className="class-form-label" style={props.numberOfColumns>1 ? {paddingLeft: `1%`} : {}}>{props.tag_municipality_input}:</label>
            </div>
        </>
    )
}

MunicipalityProvinceSelectors.propTypes = {
    name_province_input: PropTypes.string.isRequired,
    tag_province_input: PropTypes.string.isRequired,
    defaultValue_province_input: PropTypes.string.isRequired,
    isRequired_province_input: PropTypes.bool.isRequired,
    validators_province_input: PropTypes.array.isRequired,
    name_municipality_input: PropTypes.string.isRequired,
    tag_municipality_input: PropTypes.string.isRequired,
    defaultValue_municipality_input: PropTypes.string.isRequired,
    isRequired_municipality_input: PropTypes.bool.isRequired,
    validators_municipality_input: PropTypes.array.isRequired,
    numberOfColumns: PropTypes.number.isRequired
}

MunicipalityProvinceSelectors.defaultProps = {
    name_province_input: "default",
    tag_province_input: "default",
    defaultValue_province_input: "",
    isRequired_province_input: false,
    validators_province_input: [],
    name_municipality_input: "default",
    tag_municipality_input: "default",
    defaultValue_municipality_input: "",
    isRequired_municipality_input: false,
    validators_municipality_input: [],
    numberOfColumns: 1
}


export default MunicipalityProvinceSelectors