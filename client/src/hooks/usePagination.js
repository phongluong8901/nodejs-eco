import { useMemo } from 'react'

const generateRange = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => start + idx)
}

// Thêm pageSize vào đây, mặc định là 10 nếu không truyền
const usePagination = ({ totalProductCount = 0, currentPage = 1, siblingCount = 1, pageSize = 10 }) => {
    const paginationArray = useMemo(() => {
        // Ưu tiên pageSize từ props truyền vào
        const paginationCount = Math.ceil(+totalProductCount / pageSize)
        const totalPaginationItem = siblingCount + 5

        if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

        const isShowLeft = currentPage - siblingCount > 2
        const isShowRight = currentPage + siblingCount < paginationCount - 1

        if (!isShowLeft && isShowRight) {
            const leftItemCount = 3 + 2 * siblingCount
            const leftRange = generateRange(1, leftItemCount)
            return [...leftRange, '...', paginationCount]
        }

        if (isShowLeft && !isShowRight) {
            const rightItemCount = 3 + 2 * siblingCount
            const rightRange = generateRange(paginationCount - rightItemCount + 1, paginationCount)
            return [1, '...', ...rightRange]
        }

        if (isShowLeft && isShowRight) {
            const middleRange = generateRange(currentPage - siblingCount, currentPage + siblingCount)
            return [1, '...', ...middleRange, '...', paginationCount]
        }
        
        return []
    }, [totalProductCount, currentPage, siblingCount, pageSize]) // Thêm pageSize vào dependency

    return paginationArray
}

export default usePagination