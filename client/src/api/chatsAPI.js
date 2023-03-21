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
    getMessagesByGroup: gql`
        query getMessagesByGroup($username: String!, $chatId: Int!) {
            getMessagesByGroup(username: $username, groupId: $chatId) {
                text
                timestamp
                user {
                    username
                    profilePicture
                }
            }
        }
    `,
}

export default chatsAPI;