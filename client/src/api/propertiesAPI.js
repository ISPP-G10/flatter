import {gql} from 'apollo-boost';

const propertiesAPI = {
    createProperty: gql`
        mutation createProperty($title: String!, $description: String!, $province: String!, $bathroomsNumber: Int!, 
            $bedroomsNumber: Int!, $dimensions: Int!, $location: String!, $ownerUsername: String!, $price: Float!) {
                createProperty(
                    title: $title, 
                    description: $description, 
                    dimensions:$dimensions, 
                    ownerUsername: $ownerUsername, 
                    location: $location, 
                    bedroomsNumber: $bedroomsNumber,
                    bathroomsNumber: $bathroomsNumber, 
                    province: $province, 
                    price: $price
                ) {
                property {
                    title
                    description
                }
            }
        }
    `,
    logUser: gql`
                mutation logUser($username: String!, $password: String!){
                    tokenAuth(username: $username, password: $password){
                        token
                        user{
                          username
                        }
                      }
                }
    `,
    getpropertiesById: gql`
        query getPropertyId($id: Int!) {
            getPropertyById(id: $id) {
            title
            description
            dimensions
            owner {
                firstName
                lastName
            }
            location
            bedroomsNumber
            bathroomsNumber
            province
            price
            }
        }
    `,

}

export default propertiesAPI;