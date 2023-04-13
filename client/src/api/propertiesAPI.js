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
      $tags: [String]!
      $userToken: String!
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
        tags: $tags
        userToken: $userToken
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
      $tags: [String]!
      $userToken: String!
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
        tags: $tags
        userToken: $userToken
      ) {
        property {
          title
          description
        }
      }
    }
    `,
    filterProperties: gql`
      query filterProperties($pageNumber: Int!, $pageSize: Int!, $minPrice: Float, $maxPrice: Float, $municipality: String, $province: String, $tag: String, $userToken: String!) {
        getFilteredPropertiesByPriceAndCity(pageNumber: $pageNumber, pageSize: $pageSize, minPrice: $minPrice, maxPrice: $maxPrice, municipality: $municipality, province: $province, tag: $tag, userToken: $userToken) {
          properties{
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
          totalCount
        }
      }
  `,
  getPropertiesByOwner: gql`
    query getPropertiesByOwner($username: String!, $userToken: String!) {
      getPropertiesByOwner(username: $username, userToken: $userToken) {
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
    mutation deletePropertyById($propertyId: Int!, $userToken: String!) {
      deleteProperty(propertyId: $propertyId, userToken: $userToken) {
        property {
          title
        }
      }
    }
  `,
  outstandPropertyById: gql`
    mutation makePropertyOutstanding($propertyId: Int!, $userToken: String!) {
      makePropertyOutstanding(propertyId: $propertyId, userToken: $userToken) {
        property {
          isOutstanding
          title
        }
      }
    }
  `,

  getOutstandingProperties: gql`
    query getOutstanding($userToken: String!) {
      getOutstandingProperties(userToken: $userToken) {
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
    query getPropertyById($id: Int!, $userToken: String!) {
      getPropertyById(id: $id, userToken: $userToken) {
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
        query getPropertyRequestsByUsername($requesterUsername: String!, $propertyId: Int!, $userToken: String!) {
            getPetitionByRequesterToProperty(username: $requesterUsername, propertyId: $propertyId, userToken: $userToken) {
                id
                status
            }
        }
    `,
    createPropertyRequest: gql`
        mutation createPropertyRequest($message: String!, $requesterUsername: String!, $propertyId: Int!, $userToken: String!) {
            createPetition(message: $message, requesterUsername: $requesterUsername, propertyId: $propertyId, userToken: $userToken) {
                petition {
                    status
                }
            }
        }
    `,
    removePropertyRequest: gql`
        mutation removePropertyRequest($requestId: Int!, $userToken: String!) {
            deletePetition(petitionId: $requestId, userToken: $userToken) {
                petition {
                    status
                }
            }
        }
    `,
    
  addUsersToFavouriteProperty: gql`
    mutation addUsersToFavouriteProperty($username: String!, $propertyId: Int!, $userToken: String!){
        addUsersToFavouriteProperty(username: $username, propertyId: $propertyId, userToken: $userToken){
            user{
                username
            }
        }
    }
  `,
  deleteUsersToFavouriteProperty: gql`
      mutation deleteUsersToFavouriteProperty($username: String!, $propertyId: Int!, $userToken: String!){
          deleteUsersToFavouriteProperty(username: $username, propertyId: $propertyId, userToken: $userToken){
              user{
                  username
              }
          }
      }
  `,
  getFavouritePropertiesByUser: gql`
      query getFavouritePropertiesByUser($username: String!, $userToken: String!){
        getFavouriteProperties(username: $username, userToken: $userToken) {
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
