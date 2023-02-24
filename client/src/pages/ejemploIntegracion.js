import {useQuery, useMutation} from 'react-apollo';
import {gql} from 'apollo-boost';
import usersAPI from '../api/usersAPI';

import { useEffect } from 'react';

const Ejemplo = () => {

    const GET_ROLES = gql`
            query{
                getRoles{
                    role
                }
            }`;

    let result = useQuery(GET_ROLES);

    useEffect(() => {
        console.log(result.data);
    }, [result.data]);

    if (result.loading) return <p>Loading...</p>;
    return result.data.getRoles.map(({role}) => (
        <p>Role: {role}</p>
    ));

}

export default Ejemplo