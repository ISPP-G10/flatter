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

}

export default usersAPI;