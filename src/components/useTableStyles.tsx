import React, { useMemo } from 'react';
import { ITableStyles } from './Table'

const defaultStyles: ITableStyles = {
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


function useTableStyles(customStyles: ITableStyles): ITableStyles {

	return useMemo(() => ({
		drawing: {
			...defaultStyles.drawing,
			...customStyles.drawing
		},
		not_verified: {
			...defaultStyles.not_verified,
			...customStyles.not_verified
		},
		rejected: {
			...defaultStyles.rejected,
			...customStyles.rejected
		},
		verified: {
			...defaultStyles.verified,
			...customStyles.verified
		},
		completed: {
			...defaultStyles.completed,
			...customStyles.completed
		},
	}), [ customStyles ])
}

export default useTableStyles;