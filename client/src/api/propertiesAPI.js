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

}

export default propertiesAPI;