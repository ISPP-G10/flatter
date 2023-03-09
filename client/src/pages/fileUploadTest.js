import { useRef } from "react"
import { useApolloClient, gql } from "@apollo/client";

const FileUploadTest = () => {

    const inputTest = useRef(null);
    const client = useApolloClient();

    function handleClick(){
        let value = inputTest.current.files;

        console.log(value[0]);

        var reader = new FileReader();
        reader.readAsDataURL(value[0]);
        reader.onload = function () {
            client.mutate({
                mutation: gql`
                    mutation addImageToProperty($image: String!, $propertyTitle: String!){
                        addImageToProperty(image: $image, propertyTitle: $propertyTitle){
                            property{
                                location
                            }
                        }
                    }`,
                variables: {
                    propertyTitle: "test",
                    image: reader.result
                },
    
            })
            .then((response) => console.log(response)
            .catch((error) => console.log(error)));
        };
    }

    return(
        <>
            <input type="file" name="test_file" ref={inputTest}/>
            <button onClick={handleClick}>asdasd</button>    
        </>
    )
}

export default FileUploadTest