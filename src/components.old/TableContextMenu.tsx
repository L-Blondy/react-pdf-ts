import './ContextMenu.scss'
import React from 'react';
import { ContextMenu, Menu, MenuItem, MenuDivider, Icon } from '@blueprintjs/core'
import { ILibraryTable, ITableStyles, TABLE_STATUS } from './Table'

interface Props {
	left: number
	top: number
	table: ILibraryTable
	tableStyles: ITableStyles
	onStatusChange: (status: TABLE_STATUS) => void
	onDelete: (table: ILibraryTable) => void
	onClose: () => void
}

function TableContextMenu({
	left,
	top,
	table,
	tableStyles,
	onStatusChange,
	onDelete,
	onClose
}: Props) {

	const TableContextMenu = (
		<Menu className='table_context_menu'>
			<MenuItem
				text={(
					<label>
						<input
							className='icon'
							type='radio'
							id='verified'
							name='status'
							style={{ color: tableStyles.verified?.stroke }}
							defaultChecked={table.status === TABLE_STATUS.VERIFIED}
						/>
						<span className='text'>Verified</span>
					</label>
				)}
				onClick={() => onStatusChange(TABLE_STATUS.VERIFIED)}
			/>
			<MenuItem
				text={(
					<label>
						<input
							className='icon'
							type='radio'
							id='not_verified'
							name='status'
							style={{ color: tableStyles.not_verified?.stroke }}
							defaultChecked={table.status === TABLE_STATUS.NOT_VERIFIED}
						/>
						<span className='text'>Not verified</span>
					</label>
				)}
				onClick={() => onStatusChange(TABLE_STATUS.NOT_VERIFIED)}
			/>
			<MenuItem
				text={(
					<label>
						<input
							className='icon'
							type='radio'
							id='rejected'
							name='status'
							style={{ color: tableStyles.rejected?.stroke }}
							defaultChecked={table.status === TABLE_STATUS.REJECTED}
						/>
						<span className='text'>Rejected</span>
					</label>
				)}
				onClick={() => onStatusChange(TABLE_STATUS.REJECTED)}
			/>
			<MenuDivider />
			<MenuItem
				text={(
					<label>
						<Icon className='icon' icon='trash' />
						<span className='text'>Delete table</span>
					</label>
				)}
				onClick={() => onDelete(table)}
			/>
		</Menu>
	)
	ContextMenu.show(TableContextMenu, { left, top: top - 15 }, onClose)

	return null
}

export default TableContextMenu;