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
    updateProperty: gql`
        mutation updateProperty($id: Int!, $title: String!, $description: String!, $province: String!, $bathroomsNumber: Int!, 
            $bedroomsNumber: Int!, $dimensions: Int!, $location: String!, $price: Float!) {
                updateProperty(
                    propertyId: $id,
                    title: $title, 
                    description: $description, 
                    dimensions:$dimensions,
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
    filterProperties: gql`
        query filterProperties($minPrice: Float!, $maxPrice: Float!, $city: String!){
            getFilteredPropertiesByPriceAndCity(minPrice: $minPrice, maxPrice: $maxPrice, city: $city){
                id
                title
                description
                dimensions
                location
                bedroomsNumber
                bathroomsNumber
                tags {
                    name
                    color
                }
                province
                price
            }
        }
    `,
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

    `
}

export default propertiesAPI;