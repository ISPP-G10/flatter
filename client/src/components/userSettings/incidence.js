import { incidenceInputs } from "../../forms/incidenceForm";
import FlatterForm from "../forms/flatterForm";
import { useRef } from "react";
import usersAPI from "../../api/usersAPI";
import {useApolloClient} from '@apollo/client'

const Incidence = () => {

    const incidenceFormRef = useRef(null);

    const client = useApolloClient();

    // const ITOP_URL = 'http://itop.socialflatter.es'
    // const ITOP_USER = 'inquilino_basico_rest'
    // const ITOP_PWD = 'iTopInquilinoBasico_1'
    // const TICKET_CLASS = 'UserRequest'
    // const TITLE = 'Prueba de Request'
    // const DESCRIPTION = 'Ha padado esto'
    // const COMMENT = 'Created from JS'

    function handleIncidenceFormSubmit({values}){

        if(!incidenceFormRef.current.validate()) {
            
            alert('Hay campos incorrectos. Por favor, revise el formulario')
        
            return;
        }

        // let json_data = {
        //     'operation': 'core/create',
        //     'class': TICKET_CLASS,
        //     'fields': {
        //             'title': TITLE,
        //             'description': DESCRIPTION,
        //             'org_id': 'SELECT Organization AS O WHERE O.id = 5',
        //     },
        //     'comment': COMMENT,
        //     'output_fields': 'id',
        // }

        // let encoded_data = JSON.stringify(json_data)

        // const promise = new Promise((resolve, reject) => {
        //     axios({
        //         method: 'POST',
        //         url: ITOP_URL+'/webservices/rest.php?version=1.3&auth_user='+ITOP_USER+'&auth_pwd='+ITOP_PWD+'&json_data='+encoded_data,
        //         crossOrigin: true,
        //     })
        //     .then(response => resolve(response.data))
        //     .catch(e => reject(e));
        // });
        // console.log(promise.result.config.url)

        // promise.then(data => {
        //     console.log(data)
        // }).catch(e => {
        //     console.log(e)}
        // );

        let result = `curl -X POST -F 'version=1.3' -F 'auth_user=inquilino_basico_rest' -F 'auth_pwd=iTopInquilinoBasico_1' http://itop.socialflatter.es/webservices/rest.php -F 'json_data={"operation":"core/create","class":"Incident","fields":{"title":"${values.title}","description":"${values.description + "    REPORTADO POR: " + localStorage.getItem("user")}","org_id":"SELECT Organization AS O WHERE O.id = 5"},"comment":"Prueba de uso API","output_fields":"id"}'`
        client.mutate({
            mutation: usersAPI.createIncident,
            variables: {
                command: result,
            }
        }).then((response) => {
            alert("Incidencia registrada correctamente");
            window.location.reload();
        }).catch((error) => {
            alert(error.message.split("\n")[0]);
        });
        
    }

    return(
        <>
            <h2 className='section-title'>Abrir incidencia</h2>
            <FlatterForm
                ref={incidenceFormRef}
                inputs={incidenceInputs}
                numberOfColumns={1}
                buttonText='Registrar'
                onSubmit={handleIncidenceFormSubmit}
                showSuperAnimatedButton
            >
            </FlatterForm>
        </>
    );
}

export default Incidence;