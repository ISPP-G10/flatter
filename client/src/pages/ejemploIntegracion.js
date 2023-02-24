import {useQuery, gql, useMutation, useLazyQuery} from '@apollo/client';
import usersAPI from '../api/usersAPI';

import { useEffect } from 'react';

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