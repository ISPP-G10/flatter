import {gql} from 'apollo-boost';

const tagsAPI = {
    getTags: gql`
        query getAllTag{
            getAllTag{
                id
                name
                color
            }
        }
`,
}

export default tagsAPI;
