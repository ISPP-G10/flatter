import Select from 'react-select';
import tagsAPI from '../../api/tagsAPI';
import {useQuery} from '@apollo/client';
import chroma from 'chroma-js';

const TagSelector = (defaultValues) => {

  //El parametro defaultValues debe tener la siguiente estructura:
  // [{value: "1", label: "Amistoso", color: "#FFC107"}, {value: "2", label: "Deportivo", color: "#FFC107"}, ...]
  //Siendo value el id del tag, label el nombre del tag y color el color del tag

  const {data, loading} = useQuery(tagsAPI.getTags);
  const defaultV = defaultValues.initialOptions;

  //--------------------Style de tags 1--------------------

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
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
      },
    }),
  };

  //--------------------Style de tags 2--------------------

  // const colourStyles = {
  //   control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  //   multiValue: (styles, { data }) => {
  //     return {
  //       ...styles,
  //       backgroundColor: data.color,
  //       paddingTop: "5px;",
  //       paddingBottom: "5px;",
  //       paddingLeft: "10px;",
  //       paddingRight: "10px;",
  //       borderRadius: "25px;",
  //       minWidth: "100px;",
  //       alignItems: "center;",
  //       justifyContent: "center;"
  //     };
  //   },
  //   multiValueLabel: (styles, { data }) => ({
  //     ...styles,
  //     fontWeight: "bold;",
  //     color: "#FFFFFF;",
  //     letterSpacing: "1px;",
  //     fontSize: "15px;",
  //     textAlign: "center;"
  //   }),
  //   multiValueRemove: (styles, { data }) => ({
  //     ...styles,
  //     backgroundColor: data.color,
  //     color: 'white',
  //     cursor: "pointer",
  //     ':hover': {
  //       backgroundColor: data.color,
  //       color: 'white',
  //       cursor: "pointer",
  //     },
  //   }),
  // };

  //------------------------------------------------------

  if(loading) return <p>Loading...</p>
  
  const options = data.getAllTag.map((tag) => ({
    value: tag.id,
    label: tag.name,
    color: tag.color
  }));
    
  return (
    <Select 
      isMulti
      name="tags"
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
      defaultValue={defaultV}
      styles={colourStyles}
      >
    </Select>
  );
}

export default TagSelector;

