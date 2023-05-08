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
                          userpreferences{
                            inappropiateLanguage
                          }
                        }
                      }
                }
    `,
    updateUser: gql`
                mutation editUser($username: String!, $firstName: String, $lastName: String, $email: String, $role: String, $genre: String, $profilePicture: String, $biography: String, $profession: String, $userToken: String!){
                    editUser(username: $username, firstName: $firstName, lastName: $lastName, email: $email, role: $role, genre: $genre, profilePicture: $profilePicture, biography: $biography, profession: $profession, userToken: $userToken){
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
                          userpreferences{
                            inappropiateLanguage
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
            query getUserReviews($username: String!, $userToken: String!){
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
                getContractByUsername(username: $username, userToken: $userToken){
                    plan {
                        chatCreation
                        viewSelfProfileOpinions
                    }
                }
            }
    `,
    createReview: gql`
        mutation createReview ($valuedUser: String!, $evaluatorUser: String!, $text: String!, $relationship: String!, $rating: Int, $userToken: String!){
            createReview (valuedUser: $valuedUser, evaluatorUser: $evaluatorUser, text: $text, relationship: $relationship, rating: $rating, userToken: $userToken){
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
                    email
                }
            }
    `,
    changeUserPassword: gql`
        mutation changePassword($username: String!, $newPassword: String!, $oldPassword: String!, $userToken: String!){
            changeUserPassword(username: $username, newPassword: $newPassword, oldPassword: $oldPassword, userToken: $userToken){
                user{
                    username
                }
            }
        }
    `,
    filteredUsersByTagAndReview: gql`
        query getFilteredUsersByTagAndReview($pageNumber: Int!, $pageSize: Int!, $username: String!, $tag: String, $owner: Boolean, $minRating: Int, $maxRating: Int, $userToken: String!){
            getFilteredUsersByTagAndReview(pageNumber: $pageNumber, pageSize: $pageSize, username: $username, tag: $tag, owner: $owner, minRating: $minRating, maxRating: $maxRating, userToken: $userToken){
                users {  
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
                },
                totalCount
            }
        }
    `,
    updatePublicProfile: gql`
        mutation editUserPublic($username: String!, $tags: [String]!, $biography: String, $profession: String, $profilePicture: String, $firstName: String!, $lastName: String!, $birthday: String, $userToken: String!){
            editUserPublic(username: $username, biography: $biography, profession: $profession, profilePicture: $profilePicture, tags: $tags, firstName: $firstName, lastName: $lastName, birthday: $birthday, userToken: $userToken){
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
        mutation editUserPrivate($username: String!, $firstName: String!, $lastName: String!, $email: String!, $genre: String!, $role: String!, $profilePicture: String, $userToken: String!){
            editUserPrivate(username: $username, firstName: $firstName, lastName: $lastName, email: $email , genre: $genre, role: $role, profilePicture: $profilePicture, userToken: $userToken){
                user{
                    firstName
                    lastName
                    profilePicture
                    email
                    roles{
                        role
                    }
                }
            }
        }
    `,

    getRelationships: gql`
        query getRelationships($userLogin: String!, $userValued: String!, $userToken: String!){
            getRelationshipsBetweenUsers(userLogin: $userLogin, userValued: $userValued, userToken: $userToken)
        }

    `,

    getRecomendedUsers: gql`
        query getRecomendedUsers($username: String!, $userToken: String!){
            getUsersRecommendations(username: $username, userToken: $userToken){
                id
                username
                profilePicture
                firstName
                lastName
                profession
                averageRating
                tags{
                    name
                    color
                }
            }
        }
    `,

    getPlans: gql`
    query {
        getPlans {
          id
          flatterCoins
          visitsNumber
          tagsNumber
          advertisement
          chatCreation
          standardSupport
          premiumSupport
          viewSelfProfileOpinions
          planType
        }
      }
    `,
    getContractByUsername: gql`
        query getContractByUsername($username: String!, $userToken: String!){
            getContractByUsername(username: $username, userToken: $userToken){
                plan {
                    planType
                    chatCreation
                }
            }
        }
    `,

    updateUserPreferences: gql`
        mutation editUserPreferences($username: String!, $inappropiateLanguage: Boolean!, $userToken: String!){
            editUserPreferences(username: $username, inappropiateLanguage: $inappropiateLanguage, userToken: $userToken){
                userPreferences{
                    inappropiateLanguage
                }   
            }
        }
    `,

    changeContract: gql`
        mutation changeContract($numDaysSelected: Int!, $planType: String!, $token: String!, $username: String!) {
            changeContract(numDaysSelected: $numDaysSelected, planType: $planType, token: $token, username: $username) {
                contract {
                    endDate
                }         
            }
        }
    `,      

    editUserFlatterCoins: gql`
        mutation editUserFlatterCoins($username: String!, $token: String!, $flatterCoins: Int!){
            editUserFlatterCoins(username: $username, token: $token, flatterCoins: $flatterCoins){
                user{
                    username
                    flatterCoins
                }
            }
        }
    `,
}

export default usersAPI;