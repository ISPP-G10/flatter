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
                province
                price
            }
        }
    `
}

export default propertiesAPI;