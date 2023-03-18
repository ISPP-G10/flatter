import Select from 'react-select';
import tagsAPI from '../../api/tagsAPI';
import {useQuery} from '@apollo/client';

const TagSelector = () => {

  const {data, loading} = useQuery(tagsAPI.getTags);

  if(loading) return <p>Loading...</p>
  
  console.log(data.getAllTag);

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
      classNamePrefix="select">
    </Select>
  );
}

export default TagSelector;

