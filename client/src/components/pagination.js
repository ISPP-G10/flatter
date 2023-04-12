import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import "../static/css/components/pagination.css";

import leftArrow from "../static/files/icons/left-arrow.svg";
import rightArrow from "../static/files/icons/right-arrow.svg";

import PropTypes from "prop-types";
import customAlert from "../libs/functions/customAlert";

const Pagination = forwardRef(({queryCallback, resultsPerPage}, ref) => {
  const [pageData, setPageData] = useState({
    index: 0,
    next: false,
    true: false
  });

  useImperativeHandle(ref, () => {
    return {
        data: pageData,
        init: handlePagination
    };
  });

  const handlePagination = async (indexAlter = 0) => {

    if(!pageData.prev && indexAlter<0) {
      customAlert("No hay resultados anteriores");
    } else if(!pageData.next && indexAlter>0) {
      customAlert("No hay resultados posteriores");
    } else {
      const newIndex = pageData.index + indexAlter;
      
      const pageResult = await queryCallback(newIndex, resultsPerPage);
      
      setPageData({
        index: newIndex,
        next: pageResult.next,
        prev: pageResult.prev
      });

    }
  }
  
  return (
      <div className="pagination">
          <button onClick={() => { handlePagination(-1) }} >
            <img src={leftArrow} alt="Anterior"/>
          </button>

          <div>
            Página { pageData.index+1 }
          </div>

          <button onClick={() => { handlePagination(1) }}>
            <img src={rightArrow} alt="Siguiente"/>
          </button>
        </div>
  );
});

Pagination.propTypes = {
  resultsPerPage: PropTypes.number,
  queryCallback: PropTypes.func
}

Pagination.defaultProps = {
  resultsPerPage: 1
}

export default Pagination;