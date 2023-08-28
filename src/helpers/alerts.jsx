import React, { useState } from "react";
import { Alert } from "react-bootstrap";

const GetAlert = (props) => {
    const [show, setShow] = useState(true);

    const map = {
        variant: props.variant,
        message: props.message
    }

    if(show){
        return (
            <Alert key={map.type} variant={map.variant} onClose={() => setShow(false)} dismissible>
                {map.message}
            </Alert>
        )
    }

    return (<></>)
}

export default GetAlert;