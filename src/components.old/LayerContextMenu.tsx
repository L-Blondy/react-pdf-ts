import './ContextMenu.scss'
import React from 'react';
import { ContextMenu, Menu, MenuItem, Icon } from '@blueprintjs/core'

interface Props {
	left: number
	top: number
	onEnableDraw: () => void
}

function LayerContextMenu({
	left,
	top,
	onEnableDraw
}: Props) {

	const LayerContextMenu = (
		<Menu className='table_context_menu'>
			<MenuItem
				text={(
					<label>
						<Icon className='icon' icon='style' />
						<span className='text'>Draw new Table</span>
					</label>
				)}
				onClick={onEnableDraw}
			/>
		</Menu>
	)
	ContextMenu.show(LayerContextMenu, { left, top: top - 15 })

	return null
}

export default LayerContextMenu;