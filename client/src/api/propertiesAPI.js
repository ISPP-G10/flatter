import {gql} from 'apollo-boost';

const propertiesAPI = {

    getPropertiesByOwner: gql`
    query getPropertiesByOwner($username: String!){
        getPropertiesByOwner(username: $username){	
            id
            description
            tags {
                name
                color
            }
            title
            price
            isOutstanding
            province
        }
    }
`,
}

export default propertiesAPI;