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
    deletePropertyById: gql`
    mutation deletePropertyById($propertyId: Int!){
        deleteProperty(
          propertyId:$propertyId){
          property{
            title
          }
        }
      }
`,
    outStandPropertyById: gql`
    mutation outStandPropertyById($propertyId: Int!, $ownerId: Int!){
        standOutProperty(
          propertyId:$propertyId,
            ownerId:$ownerId){
          property{
            isOutstanding,
            title
          }
        }
      }

`,}

export default propertiesAPI;