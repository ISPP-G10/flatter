import {gql} from 'apollo-boost';

const usersAPI = {
    createUser: gql`
                mutation createUser ($username: String!, $password: String!, $firstName: String!, $lastName: String!, $email: String!, $roles: String!, $genre: String!){
                    createUser (username: $username, password: $password, firstName: $firstName, lastName: $lastName, email: $email, roles: $roles, genre: $genre){
                        user{
                            username
                        }
                    }

                    tokenAuth(username: $username, password: $password){
                        token
                        user{
                          username
                        }
                      }
                }
    `,
    updateUser: gql`
                mutation editUser($username: String!, $firstName: String, $lastName: String, $email: String, $role: String, $genre: String, $phoneNumber: String, $profilePicture: String, $biography: String, $profession: String){
                    editUser(username: $username, firstName: $firstName, lastName: $lastName, email: $email, role: $role, genre: $genre, phone: $phoneNumber, profilePicture: $profilePicture, biography: $biography, profession: $profession){
                        user{
                            username
                            roles{
                                role
                            }
                            age
                            birthday
                        }
                    }
                }
    `,
    logUser: gql`
                mutation logUser($username: String!, $password: String!){
                    tokenAuth(username: $username, password: $password){
                        token
                        user{
                          username
                          roles{
                            role
                          }
                        }
                      }
                }
    `,
    getUserByUsernameHeader: gql`
            query getUserByUsername($username: String!){
                getUserByUsername(username: $username){
                    username
                    profilePicture
    				flatterCoins
                }
            }
    `,
    getPublicProfileByUsername: gql`
            query getUserReviews($username: String!){
                getUserByUsername(username: $username){
                    firstName
                    lastName
                    profilePicture
                    age
                    biography
                    profession
                    birthday
                    averageRating
                    roles{
                        role
                    }
                    tags{
                        name
                        color
                    }
                    valuedReviews{
                        text
                        evaluatorUser{
                            username
                            firstName
                            lastName
                            profilePicture
                            genre
                        }
                        rating
                        relationship
                    }
                }
            }
    `,
    createReview: gql`
        mutation createReview ($valuedUser: String!, $evaluatorUser: String!, $text: String!, $relationship: String!, $rating: Int){
            createReview (valuedUser: $valuedUser, evaluatorUser: $evaluatorUser, text: $text, relationship: $relationship, rating: $rating){
                review{
                    text
                    evaluatorUser{
                        username
                        firstName
                        lastName
                        profilePicture
                        genre
                    }
                    valuedUser{
                        averageRating
                    }
                    rating
                    relationship
                }
            }
        }
`,
    getUserByUsernameSettings: gql`
            query getUserByUsername($username: String!){
                getUserByUsername(username: $username){
                    username
                    profilePicture
    				firstName
                    lastName
                    genre
                    roles{
                        role
                    }
                    phoneNumber
                    email
                }
            }
    `,
    changeUserPassword: gql`
        mutation changePassword($username: String!, $newPassword: String!, $oldPassword: String!){
            changeUserPassword(username: $username, newPassword: $newPassword, oldPassword: $oldPassword){
                user{
                    username
                }
            }
        }
    `,
    filteredUsersByTagAndReview: gql`
        query getFilteredUsersByTagAndReview($tag: String){
            getFilteredUsersByTagAndReview(tag: $tag){
            id
            firstName
            lastName
            username
            profilePicture
            profession
            averageRating
            }
        }
    `,
    createIncident: gql`
        mutation createIncident($command: String!){
            createIncident(command: $command){
                incident{
                    command
                }
            }
        }
    `,
    createRequest: gql`
    mutation createRequest($command: String!){
        createRequest(command: $command){
            request{
                command
                }
            }
        }
    `,
    updatePublicProfile: gql`
        mutation editUserTags($username: String!, $tags: [String]!, $biography: String, $profession: String, $profilePicture: String, $firstName: String, $lastName: String){
            editUser(username: $username, biography: $biography, profession: $profession, profilePicture: $profilePicture, tags: $tags, firstName: $firstName, lastName: $lastName){
                user{
                    firstName
                    lastName
                    profilePicture
                    biography
                    profession
                    birthday
                    averageRating
                    roles{
                        role
                    }
                    tags{
                        name
                        color
                    }
                }
            }
        }
    `,

    editUserPublic: gql`
        mutation editUserPublic($username: String!, $tags: [String]!, $firstName: String!, $lastName: String! $birthday: String, $biography: String, $profession: String, $profilePicture: String){
            editUserPublic(username: $username, tags: $tags, firstName: $firstName, lastName: $lastName, birthday: $birthday, biography: $biography, profession: $profession, profilePicture: $profilePicture){
                user{
                    username
                    tags{
                        name
                        color
                    }
                    age
                    birthday
                    profession
                    biography
                    firstName
                    lastName
                    profilePicture
                }
            }
        }
        `,

}   

export default usersAPI;