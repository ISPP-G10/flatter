import Hero from '../sections/hero';
import Modal from '../sections/modal';
import FormProperty from './formProperty';
import SolidButton from '../sections/solidButton';

import PropTypes from "prop-types";

const ModalProperty = ({property}) => {

    property = {};

    return (
        <Modal id="edit-property" title={ property.title !== undefined ? `Editar Propiedad ${property.title}` : `Crear nueva Propiedad` }>
            <FormProperty property={property} />
        </Modal>
    )

}

ModalProperty.propTypes = {
    property: PropTypes.object
}

ModalProperty.defaultProps = {
    property: {}
}

export default ModalProperty;