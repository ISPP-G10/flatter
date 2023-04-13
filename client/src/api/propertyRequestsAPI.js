import {gql} from 'apollo-boost';

const propertyRequestsAPI = {

    getPetitions: gql`
    query getPetitions($username: String!, $status: String, $startDate: String, $endDate: String){
        getPetitionsByStatusAndUsernameAndDates(username: $username, status: $status, startDate: $startDate, endDate: $endDate){
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
    mutation updateStatusPetition($petitionId: Int!, $statusPetition: String!){
        updateStatusPetition(petitionId: $petitionId, statusPetition: $statusPetition){
            petition{
              status
              id
            }
        }
    }
`,
}

export default propertyRequestsAPI;
