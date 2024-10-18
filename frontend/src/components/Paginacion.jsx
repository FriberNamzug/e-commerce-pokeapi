import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination'
import { useSearchParams } from 'react-router-dom'
import PropTypes from 'prop-types'



Paginacion.propTypes = {
    count: PropTypes.number.isRequired,
    setOffset: PropTypes.func.isRequired,
}
export default function Paginacion({
    count,           //Total de elementos
    setOffset,       //Funcion para cambiar el offset de la consulta
}) {



    const [searchParams, setSearchParams] = useSearchParams()
    const limit = parseInt(searchParams.get('limit')) || 20

    const maxPageNum = 5;
    const pageNumbers = [];




    for (let i = 1; i <= Math.ceil(count / limit); i++) {
        pageNumbers.push(i);
    }

    const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible
    const totalPages = Math.ceil(count / limit)
    const currentPage = Number(searchParams.get('page')) || 1


    let activePages = pageNumbers.slice(
        Math.max(0, currentPage - 1 - pageNumLimit),
        Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
    );



    // Función para cambiar el offset según la página
    const handlePageChange = (page) => {
        const newOffset = (page - 1) * limit;  // Calcular el offset en base a la nueva página
        setOffset(newOffset);                  // Actualizar el offset
        const params = new URLSearchParams(searchParams);
        params.set('page', page);              // Actualizar el parámetro de página en la URL
        setSearchParams(params);               // Actualizar la URL
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1)
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1)
        }
    };




    const renderPages = () => {
        const renderedPages = activePages.map((page, idx) => (
            <PaginationItem
                key={idx}
                className={currentPage === page ? "bg-neutral-100 rounded-md" : ""}
            >
                <PaginationLink
                    className={currentPage === page ? 'cursor-default' : 'cursor-pointer'}
                    onClick={() => handlePageChange(page)}>
                    {page}
                </PaginationLink>
            </PaginationItem>
        ));

        // Add ellipsis at the start if necessary
        if (activePages[0] > 1) {
            renderedPages.unshift(
                <PaginationEllipsis
                    key="ellipsis-start"
                    onClick={() => handlePageChange(activePages[0] - 1)}
                />
            );
        }

        // Add ellipsis at the end if necessary
        if (activePages[activePages.length - 1] < pageNumbers.length) {
            renderedPages.push(
                <PaginationEllipsis
                    key="ellipsis-end"
                    onClick={() =>
                        handlePageChange(activePages[activePages.length - 1] + 1)
                    }
                />
            );
        }

        return renderedPages;
    };



    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={currentPage > 1 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50 hover:bg-transparent'}
                            onClick={handlePrevPage} />
                    </PaginationItem>

                    {renderPages()}

                    <PaginationItem>
                        <PaginationNext
                            className={currentPage < totalPages ? 'cursor-pointer' : 'cursor-not-allowed opacity-50 hover:bg-transparent'}
                            onClick={handleNextPage} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
