import '../static/css/components/flatterModal.css'
import {motion, AnimatePresence} from 'framer-motion';
import {forwardRef, useImperativeHandle, useState, useRef, useEffect} from 'react';

const FlatterModal = forwardRef((props, ref) => {

    const [open, setOpen] = useState(false);
    let modalContentWrapper = useRef(null);

    useImperativeHandle(ref, () => {
        return{
            open: () => setOpen(true),
            close: () => setOpen(false),
        };
    });

    useEffect(() => {
        if(modalContentWrapper.current){
            modalContentWrapper.current.style.maxHeight = `${props.maxHeight ? props.maxHeight : 600}px`;
            modalContentWrapper.current.style.maxWidth = `${props.maxWidth ? props.maxWidth : 500}px`;
        }

        // eslint-disable-next-line
    }, [open]);

    return(
        <AnimatePresence>
            {
                open && (
                    <>
                        <motion.div 
                            initial={{
                                opacity: 0
                            }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    duration: 0.3
                                }
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    delay: 0.3,
                                }
                            }}
                            onClick={() => setOpen(false)}
                            className="modal-backdrop"/>

                        <motion.div 
                            initial={{
                                scale: 0
                            }}
                            animate={{
                                scale: 1,
                                transition: {
                                    duration: 0.3
                                }
                            }}
                            exit={{
                                scale: 0,
                                transition: {
                                    delay: 0.3,
                                }
                            }}
                            className="modal-content-wrapper" ref={modalContentWrapper}>

                            <motion.div 
                                initial={{
                                    x: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: {
                                        delay: 0.3,
                                        duration: 0.3
                                    },
                                }}
                                exit={{
                                    x: 100,
                                    opacity: 0,
                                    transition: {
                                        duration: 0.3
                                    }
                                }}
                                className="modal-content">

                                {props.children}

                            </motion.div>

                        </motion.div>
                    </>
                )
            }
        </AnimatePresence>
    );
});

export default FlatterModal;