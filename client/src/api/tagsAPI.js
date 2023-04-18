import {gql} from 'apollo-boost';

const tagsAPI = {
    getTags: gql`
        query getAllTag($userToken: String!){
            getAllTag(userToken: $userToken){
                id
                name
                color
            }
        }
    `,

    getTagsByType: gql`
        query getTagsByType($type: String!, $userToken: String!){
            getTagsByType(tagType: $type, userToken: $userToken){
                id
                name
                color
            }
        }
    `,
}

export default tagsAPI;
