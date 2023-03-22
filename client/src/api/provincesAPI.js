import {gql} from 'apollo-boost';

const provincesApi = {
    getAllProvincesAndMunicipes: gql`
        query getAllProvincesAndMunicipes{
            getProvincesMunicipalities(name: ""){
                name
                municipalitySet{
                    name
                }
            }
        }
    `,
}

export default provincesApi;