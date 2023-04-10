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
        subscription messageSubscription($username: String!, $chatId: Int!) {
            messageSubscription(username: $username, groupId: $chatId) {
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
    newGroups: gql`
        subscription groupSubscription($username: String!) {
            groupSubscription(username: $username) {
                groupAndLastMessage{
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
    getInappropiateLanguage: gql`
        query getInappropiateLanguage($username: String!) {
            getInappropiateLanguage(username: $username) {
                word
            }
        }
    `,
}

export default chatsAPI;