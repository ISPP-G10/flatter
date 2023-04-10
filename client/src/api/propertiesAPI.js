import { gql } from "apollo-boost";

const propertiesAPI = {
  createProperty: gql`
    mutation createProperty(
      $title: String!
      $description: String!
      $province: String!
      $bathroomsNumber: Int!
      $bedroomsNumber: Int!
      $dimensions: Int!
      $location: String!
      $municipality: String!
      $ownerUsername: String!
      $price: Float!
      $images: [String]
      $maxCapacity: Int!
    ) {
      createProperty(
        title: $title
        description: $description
        dimensions: $dimensions
        ownerUsername: $ownerUsername
        location: $location
        bedroomsNumber: $bedroomsNumber
        bathroomsNumber: $bathroomsNumber
        province: $province
        municipality: $municipality
        price: $price
        images: $images
        maxCapacity: $maxCapacity
      ) {
        property {
          title
          description
        }
      }
    }
  `,
  updateProperty: gql`
    mutation updateProperty(
      $id: Int!
      $title: String!
      $description: String!
      $province: String!
      $bathroomsNumber: Int!
      $bedroomsNumber: Int!
      $dimensions: Int!
      $location: String!
      $municipality: String!
      $price: Float!
      $images: [String]
    ) {
      updateProperty(
        propertyId: $id
        title: $title
        description: $description
        dimensions: $dimensions
        location: $location
        bedroomsNumber: $bedroomsNumber
        bathroomsNumber: $bathroomsNumber
        province: $province
        municipality: $municipality
        price: $price
        images: $images
      ) {
        property {
          title
          description
        }
      }
    }
    `,
    filterProperties: gql`
        query filterProperties($minPrice: Float, $maxPrice: Float, $municipality: String) {
          getFilteredPropertiesByPriceAndCity(minPrice: $minPrice, maxPrice: $maxPrice, municipality: $municipality) {
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
                owner {
                    username
                }
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
    query getPropertiesByOwner($username: String!) {
      getPropertiesByOwner(username: $username) {
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
        images {
          image
        }
      }
    }
  `,
  deletePropertyById: gql`
    mutation deletePropertyById($propertyId: Int!) {
      deleteProperty(propertyId: $propertyId) {
        property {
          title
        }
      }
    }
  `,
  outstandPropertyById: gql`
    mutation makePropertyOutstanding($propertyId: Int!) {
      makePropertyOutstanding(propertyId: $propertyId) {
        property {
          isOutstanding
          title
        }
      }
    }
  `,

  getOutstandingProperties: gql`
    query getOutstanding {
      getOutstandingProperties {
        id
        owner {
          firstName
          lastName
          profilePicture
        }
        images {
          image
        }
      }
    }
  `,

  getPropertyById: gql`
    query getPropertyById($id: Int!) {
      getPropertyById(id: $id) {
        id
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
        dimensions
        bedroomsNumber
        bathroomsNumber
        maxCapacity
        interestedUsers {
          username
        }
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
    getPropertyRequestsByUsername: gql`
        query getPropertyRequestsByUsername($requesterUsername: String!, $propertyId: Int!) {
            getPetitionByRequesterToProperty(username: $requesterUsername, propertyId: $propertyId) {
                id
                status
            }
        }
    `,
    createPropertyRequest: gql`
        mutation createPropertyRequest($message: String!, $requesterUsername: String!, $propertyId: Int!) {
            createPetition(message: $message, requesterUsername: $requesterUsername, propertyId: $propertyId) {
                petition {
                    status
                }
            }
        }
    `,
    removePropertyRequest: gql`
        mutation removePropertyRequest($requestId: Int!) {
            deletePetition(petitionId: $requestId) {
                petition {
                    status
                }
            }
        }
    `,
    
  addUsersToFavouriteProperty: gql`
    mutation addUsersToFavouriteProperty($username: String!, $propertyId: Int!){
        addUsersToFavouriteProperty(username: $username, propertyId: $propertyId){
            user{
                username
            }
        }
    }
  `,
  deleteUsersToFavouriteProperty: gql`
      mutation deleteUsersToFavouriteProperty($username: String!, $propertyId: Int!){
          deleteUsersToFavouriteProperty(username: $username, propertyId: $propertyId){
              user{
                  username
              }
          }
      }
  `,
  getFavouritePropertiesByUser: gql`
      query getFavouritePropertiesByUser($username: String!){
        getFavouriteProperties(username: $username) {
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
          municipality{
            name
          }
          price
          isOutstanding
          maxCapacity
          images {
            image
          }
          flatmates {
            firstName
            lastName
          }
        }
      }
  `,
};

export default propertiesAPI;
