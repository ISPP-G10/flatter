import {gql} from 'apollo-boost';

const propertyRequestsAPI = {

    getPetitions: gql`
    query getPetitions($username: String!, $status: String, $startDate: String, $endDate: String, $userToken: String!){
        getPetitionsByStatusAndUsernameAndDates(username: $username, status: $status, startDate: $startDate, endDate: $endDate, userToken: $userToken){
          id
          status
          message
          property{
            maxCapacity
            id
            title
          }
          requester{
            firstName
            lastName
            averageRating
            username
            profilePicture
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
}

export default propertyRequestsAPI;
