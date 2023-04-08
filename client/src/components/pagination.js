import { useState } from "react";

import "../static/css/components/pagination.css";

import leftArrow from "../static/files/icons/left-arrow.svg";
import rightArrow from "../static/files/icons/right-arrow.svg";

const Pagination = ({isNextPage, callback, resultsPerPage}) => {
  const [page, setPage] = useState(0);

  

  const handlePagination = (indexAlter) => {

    let paginationIndex = indexAlter>0 && isNextPage === true ? page + 1 : (page!==0 && indexAlter < 0 ? page - 1 : page);

    setPage(paginationIndex);

    callback(paginationIndex);
  }
  
  return (
      <div className="pagination">
          <button onClick={() => { handlePagination(-1) }} >
            <img src={leftArrow} alt="Anterior"/>
          </button>

          <div>
            Página { page+1 }
          </div>

          <button onClick={() => { handlePagination(1) }}>
            <img src={rightArrow} alt="Siguiente"/>
          </button>
        </div>
  );
}

export default Pagination;