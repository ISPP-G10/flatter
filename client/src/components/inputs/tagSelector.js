import '../../static/css/components/tagSelector.css'
import Select from 'react-select';
import chroma from 'chroma-js';
import {forwardRef, useState} from 'react';
import PropTypes from 'prop-types';


const TagSelector = forwardRef((props, tagRef) => {

  //El parametro defaultValues debe tener la siguiente estructura:
  // [{value: "1", label: "Amistoso", color: "#FFC107"}, {value: "2", label: "Deportivo", color: "#FFC107"}, ...]
  //Siendo value el id del tag, label el nombre del tag y color el color del tag


  function tagsTransform(values){
    let tags = [];
    tags = values.map((tag) => ({
      value: tag.name,
      label: tag.name,
      color: tag.color
    }));
    return tags;
  }

  const [selectedOptions, setSelectedOptions] = useState(tagsTransform(props.defaultValues));
  const [maxReached, setMaxReached] = useState(false);
  const tagOptions = tagsTransform(props.options);


  //--------------------Style de tags 1--------------------

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white', borderColor: '#92278f', borderRadius: '1px'}),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
        cursor: 'pointer',
      },
    }),
  };

  const handleSelectChange = (selectedOptions) => {
    if (selectedOptions.length <= props.max) {
      setMaxReached(false)
      setSelectedOptions(selectedOptions);
    } else{
      setMaxReached(true)
    }
  };
    
  return (
      <>
        
          {
            maxReached ? 
              <label htmlFor='tags-input'>
                <p style={{color: '#cc0033', fontSize: '13px'}}>Límite de etiquetas alcanzado.</p>
              </label>
            :
              <></>
          }
          
        <Select 
          isMulti
          id="tags-input"
          name="tags"
          options={tagOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          styles={colourStyles}
          value={selectedOptions}
          onChange={handleSelectChange}
          placeholder="Selecciona las etiquetas"
          ref={tagRef}
          >
        </Select>
      </>
  );
});

TagSelector.defaultProps = {
  defaultValues: [],
  options: [],
  max: 8
};

TagSelector.propTypes = {
  defaultValues: PropTypes.array,
  options: PropTypes.array,
  max: PropTypes.number
};

export default TagSelector;

