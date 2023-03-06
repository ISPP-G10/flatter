import {useQuery, gql} from '@apollo/client';

const Ejemplo = () => {

    const GET_ROLES = gql`
            query GetRoles{
                getRoles{
                    role
                }
            }`;

    const {data, loading} = useQuery(GET_ROLES);

    if (loading) return <p>Loading...</p>

    return data && data.getRoles.map(({role}) => (
        <p>Role: {role}</p>
    ));

}

export default Ejemplo