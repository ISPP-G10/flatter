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

    getTagsByType: gql`
        query getTagsByType($type: String!){
            getTagsByType(tagType: $type){
                id
                name
                color
            }
        }
    `,
}

export default tagsAPI;
