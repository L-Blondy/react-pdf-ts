import React, { useCallback, useMemo } from 'react';
import { useUpdatedRef } from 'src/hooks';
import { ILibraryTable, IAllTableStyles, ITableStyles, TABLE_STATUS } from './Table'

const defaultStyles: IAllTableStyles = {
	drawing: {
		stroke: '#87cefa90',
		fill: '#87cefa40',
		strokeWidth: 2
	},
	not_verified: {
		stroke: '#ffbb00',
		fill: '#ffbb0020',
		strokeWidth: 2
	},
	rejected: {
		stroke: '#ff0000',
		fill: '#ff000020',
		strokeWidth: 2
	},
	verified: {
		stroke: '#00ff00',
		fill: '#00ff0020',
		strokeWidth: 2
	},
	completed: {
		stroke: '#00bbff',
		fill: '#00bbff20',
		strokeWidth: 2
	}
}


function useTableStyles(customStyles: IAllTableStyles) {

	const customStylesRef = useUpdatedRef(customStyles)

	const tableStyles = useMemo(() => ({
		drawing: {
			...defaultStyles.drawing,
			...customStylesRef.current.drawing
		},
		not_verified: {
			...defaultStyles.not_verified,
			...customStylesRef.current.not_verified
		},
		rejected: {
			...defaultStyles.rejected,
			...customStylesRef.current.rejected
		},
		verified: {
			...defaultStyles.verified,
			...customStylesRef.current.verified
		},
		completed: {
			...defaultStyles.completed,
			...customStylesRef.current.completed
		},
	}), [ customStylesRef ])

	const getTableStyles = useCallback((table: ILibraryTable): ITableStyles => {
		if (table.reviewStatus === TABLE_STATUS.VERIFIED)
			return tableStyles.completed
		if (table.status === TABLE_STATUS.VERIFIED)
			return tableStyles.verified
		if (table.status === TABLE_STATUS.REJECTED)
			return tableStyles.rejected
		return tableStyles.not_verified
	}, [ tableStyles ])

	return getTableStyles
}

export default useTableStyles;