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
        query getMunicipalitiesByProvince($province: String!){
            getMunicipalitiesByProvince(province: $province){
                name
            }
        }
    `,
}

export default provincesAPI;