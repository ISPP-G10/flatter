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
                mutation editUser($username: String!, $firstName: String, $lastName: String, $email: String, $role: String, $genre: String, $phoneNumber: String, $profilePicture: String){
                    editUser(username: $username, firstName: $firstName, lastName: $lastName, email: $email, role: $role, genre: $genre, phone: $phoneNumber, profilePicture: $profilePicture){
                        user{
                            username
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
    `

}

export default usersAPI;