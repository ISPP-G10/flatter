import {gql} from 'apollo-boost';

const personalRequestsAPI = {

    getPersonalPetitions: gql`
    query getPetitions($username: String!, $status: String, $startDate: String, $endDate: String, $userToken: String!){
      getPetitionsByRequesterAndStatusAndDates(username: $username, status: $status, startDate: $startDate, endDate: $endDate, userToken: $userToken){
        id
        status
        dateOfPetitionAcepted
        requester{
          firstName
          lastName
          username
        }
        property{
          maxCapacity
          id
          title
          price
          province{
            name
          }
          images{
            image
            id
          }
        }
      }
    }
`,
    updateStatusPetition: gql`
    mutation updateStatusPetition($petitionId: Int!, $statusPetition: String!, $userToken: String!){
      updateStatusPetition(petitionId: $petitionId, statusPetition: $statusPetition, userToken: $userToken){
        petition{
          status
          id
        }
      }
    }
`,

    addUserToProperty: gql`
    mutation addUserToProperty($propertyId: Int!, $username: String!, $userToken: String!){
      addUserToProperty(propertyId: $propertyId, username: $username, userToken: $userToken){
        user{
          username
        }
    		property{
          title
          id
        }    				
      }
    }
`,
};

export default personalRequestsAPI;
