import {gql} from 'apollo-boost';

const propertiesAPI = {
    
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
        province
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