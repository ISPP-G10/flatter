import {gql} from 'apollo-boost';

const personalRequestsAPI = {

    getPersonalPetitions: gql`
    query getPetitions($username: String!, $status: String, $startDate: String, $endDate: String){
      getPetitionsByRequesterAndStatusAndDates(username: $username, status: $status, startDate: $startDate, endDate: $endDate){
        id
        status
        dateOfPetitionAcepted
        requester{
          firstName
          lastName
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

export default personalRequestsAPI;
