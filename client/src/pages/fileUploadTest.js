import { useRef } from "react"
import { useApolloClient, gql } from "@apollo/client";

const FileUploadTest = () => {

    const inputTest = useRef(null);
    const client = useApolloClient();

    function handleClick(){
        let value = inputTest.current.value;

        client.mutate({
            mutation: gql``,
            variables: {
                image: value
            }
        })
        .then((response) => console.log(response)
        .catch((error) => console.log(error)));
    }

    return(
        <>
            <input type="file" name="test_file" ref={inputTest}/>
            <button onClick={handleClick}></button>    
        </>
    )
}

export default FileUploadTest