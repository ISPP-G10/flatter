import {gql} from 'apollo-boost';

const propertiesAPI = {
    createProperty: gql`
        mutation createProperty($title: String!, $description: String!, $province: String!, $bathroomsNumber: Int!, 
            $bedroomsNumber: Int!, $dimensions: Int!, $location: String!, $ownerUsername: String!, $price: Float!, $images: [String], $maxCapacity: Int!,
            $municipality: String!) {
                createProperty(
                    title: $title, 
                    description: $description, 
                    dimensions:$dimensions, 
                    ownerUsername: $ownerUsername, 
                    location: $location, 
                    bedroomsNumber: $bedroomsNumber,
                    bathroomsNumber: $bathroomsNumber, 
                    province: $province, 
                    price: $price,
                    images: $images,
                    maxCapacity: $maxCapacity,
                    municipality: $municipality
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
            $bedroomsNumber: Int!, $dimensions: Int!, $location: String!, $price: Float!, $images: [String], $municipality: String!) {
                updateProperty(
                    propertyId: $id,
                    title: $title, 
                    description: $description, 
                    dimensions:$dimensions,
                    location: $location, 
                    bedroomsNumber: $bedroomsNumber,
                    bathroomsNumber: $bathroomsNumber, 
                    province: $province, 
                    price: $price,
                    images: $images,
                    municipality: $municipality

                ) {
                property {
                    title
                    description
                }
            }
        }
    `,
    filterProperties: gql`
        query filterProperties($minPrice: Float, $maxPrice: Float, $city: String){
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
                province{
                    name
                }
                price
                isOutstanding
                maxCapacity
                images{
                    image
                }
                flatmates{
                    firstName
                    lastName
                }
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
                province{
                    name
                }
                municipality{
                    name
                }
                location
                dimensions
                bedroomsNumber
                bathroomsNumber
                maxCapacity
                images{
                    image
                }
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
    outstandPropertyById: gql`
        mutation makePropertyOutstanding($propertyId: Int!){
            makePropertyOutstanding(propertyId: $propertyId){
                property{
                    isOutstanding,
                    title
                }
            }
        }

    `,
    
    getOutstandingProperties: gql`
    
    query getOutstanding{
        getOutstandingProperties{
            id
            owner{
            firstName
            lastName
            profilePicture
            }
            images{
            image
            }
        }
    }
    
    `,

    getPropertyById: gql`
    query getPropertyById($id: Int!){
      getPropertyById(id: $id) {
        title
        location
        province{
            name
        }
        municipality{
            name
        }
        description
        price
        owner {
          username
          firstName
          lastName
          profilePicture
          profession
          averageRating
        }
        maxCapacity
        images {
            image
        }
        tags {
          name
          color
        }
        flatmates {
          username
          firstName
          lastName
          profilePicture
          profession
          averageRating
        }
      }
    }
    `,

}

export default propertiesAPI;