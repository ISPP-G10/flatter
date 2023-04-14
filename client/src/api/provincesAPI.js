import {gql} from 'apollo-boost';

const provincesAPI = {
    getAllProvinces: gql`
        query getAllProvinces{
            getProvinces(name: ""){
                name
            }
        }
    `,
    getMunicipalitiesByProvince: gql`
        query getMunicipalitiesByProvince($province: String!, $userToken: String!){
            getMunicipalitiesByProvince(province: $province, userToken: $userToken){
                name
            }
        }
    `,
}

export default provincesAPI;