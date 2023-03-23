import {gql} from 'apollo-boost';

const chatsAPI = {
    getMyGroups: gql`
        query getMyGroups($username: String!) {
            getMyGroups(username: $username) {
                group{
                    id
                    name
                    individual
                    users {
                        username
                        profilePicture
                    }
                }
                lastMessage {
                    text
                    timestamp
                }
                
            }
        }
    `,
    getMessagesByGroup: gql`
        query getMessagesByGroup($username: String!, $chatId: Int!) {
            getMessagesByGroup(username: $username, groupId: $chatId) {
                key
                value{
                    text
                    timestamp
                    user{
                        username
                        profilePicture
                    }
                    group{
                        individual
                    }
                }
            }
        }
    `,
    createMessage: gql`
        mutation createMessage($username: String!, $chatId: Int!, $text: String!) {
            createMessage(username: $username, groupId: $chatId, text: $text) {
                message{
                    text
                    timestamp
                }
            }
        }
    `,
    newMessages: gql`
        subscription messageSubscription($username: String!) {
            messageSubscription(username: $username) {
                message{
                    text
                    timestamp
                    user{
                        username
                        profilePicture
                    }
                    group{
                        individual
                    }
                }
            }
        }
    `,
    createIndividualChat: gql`
        mutation createIndividualGroup($username: String!, $users: [String!]!) {
            createIndividualGroup(username: $username, users: $users) {
                group{
                    id
                    name
                    individual
                    users {
                        username
                        profilePicture
                    }
                }
            }
        }
    `,
    createGroupalChat: gql`
        mutation createGroupalGroup($username: String!, $groupName: String!, $users: [String!]!) {
            createGroupalGroup(username: $username, groupName: $groupName, users: $users) {
                group{
                    id
                    name
                    individual
                    users {
                        username
                        profilePicture
                    }
                }
            }
        }
    `,
}

export default chatsAPI;