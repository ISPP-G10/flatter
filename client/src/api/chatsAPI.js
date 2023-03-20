import {gql} from 'apollo-boost';

const chatsAPI = {
    getMyGroups: gql`
        query getMyGroups($username: String!) {
            getMyGroups(username: $username) {
                id
                name
                individual
                users {
                    username
                    profilePicture
                }
            }

            getMyMessages(username: $username) {
                text
                timestamp
                group {
                    id
                }
            }
        }
    `,
}

export default chatsAPI;