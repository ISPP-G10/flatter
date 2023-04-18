import {gql} from 'apollo-boost';

const chatsAPI = {
    getMyGroups: gql`
        query getMyGroups($username: String!, $userToken: String!) {
            getMyGroups(username: $username, userToken: $userToken) {
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
        query getMessagesByGroup($username: String!, $chatId: Int!, $userToken: String!) {
            getMessagesByGroup(username: $username, groupId: $chatId, userToken: $userToken) {
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
        mutation createMessage($username: String!, $chatId: Int!, $text: String!, $userToken: String!) {
            createMessage(username: $username, groupId: $chatId, text: $text, userToken: $userToken) {
                message{
                    text
                    timestamp
                }
            }
        }
    `,
    newMessages: gql`
        subscription messageSubscription($username: String!, $chatId: Int!, $userToken: String!) {
            messageSubscription(username: $username, groupId: $chatId, userToken: $userToken) {
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
        subscription groupSubscription($username: String!, $userToken: String!) {
            groupSubscription(username: $username, userToken: $userToken) {
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
                        user{
                            username
                            profilePicture
                            firstName
                            lastName
                        }
                    }
                }
            }
        }
    `,
    createIndividualChat: gql`
        mutation createIndividualGroup($username: String!, $users: [String!]!, $userToken: String!) {
            createIndividualGroup(username: $username, users: $users, userToken: $userToken) {
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
        mutation createGroupalGroup($username: String!, $groupName: String!, $users: [String!]!, $userToken: String!) {
            createGroupalGroup(username: $username, groupName: $groupName, users: $users, userToken: $userToken) {
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
        query getInappropiateLanguage($username: String!, $userToken: String!) {
            getInappropiateLanguage(username: $username, userToken: $userToken) {
                word
            }
        }
    `,
}

export default chatsAPI;