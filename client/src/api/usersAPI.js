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
                          roles{
                            role
                          }
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
        query getFilteredUsersByTagAndReview($username: String!, $tag: String, $owner: Boolean){
            getFilteredUsersByTagAndReview(username: $username, tag: $tag, owner: $owner){
                id
                firstName
                lastName
                username
                profilePicture
                profession
                averageRating
                tags{
                    name
                    color
                }
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
        mutation editUserPublic($username: String!, $tags: [String]!, $biography: String, $profession: String, $profilePicture: String, $firstName: String!, $lastName: String!, $birthday: String){
            editUserPublic(username: $username, biography: $biography, profession: $profession, profilePicture: $profilePicture, tags: $tags, firstName: $firstName, lastName: $lastName, birthday: $birthday){
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
    updatePrivateProfile: gql`
        mutation editUserPrivate($username: String!, $firstName: String!, $lastName: String!, $email: String!, $phone: String, $genre: String!, $role: String!, $profilePicture: String){
            editUserPrivate(username: $username, firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, genre: $genre, role: $role, profilePicture: $profilePicture){
                user{
                    firstName
                    lastName
                    profilePicture
                    email
                    phoneNumber
                    roles{
                        role
                    }
                }
            }
        }
    `,

    getRelationships: gql`
        query getRelationships($userLogin: String!, $userValued: String!){
            getRelationshipsBetweenUsers(userLogin: $userLogin, userValued: $userValued)
        }
    `,
}

export default usersAPI;