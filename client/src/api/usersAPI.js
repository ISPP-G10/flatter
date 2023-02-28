import {gql} from 'apollo-boost';

const usersAPI = {
    createUser: gql`
                mutation createUser ($username: String!, $password: String!, $firstName: String!, $lastName: String!, $email: String!){
                    createUser (username: $username, password: $password, firstName: $firstName, lastName: $lastName, email: $email){
                        user{
                            username
                        }
                    }
                }
    `,
    getRoles: gql`
            query{
                getRoles{
                    role
                }
            }
    `

}

export default usersAPI;