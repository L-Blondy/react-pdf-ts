import './PDFPage.scss'
import React, { useState } from 'react';
import PDFPageCanvas, { IPDFPageCanvasProps } from './PDFPageCanvas'
import { KonvaEventObject } from 'konva/types/Node';
import { LayerContextMenu } from './'
import { IServerTable } from './Table';
import { useGlobalKeyDown, useGlobalKeyUp } from 'src/hooks';

interface Props extends Omit<IPDFPageCanvasProps, 'enableDraw'> {
	readOnly?: boolean
	hidePageNumber?: boolean
	hideTags?: boolean
}

function PDFPage({
	pageNumber,
	readOnly = false,
	hidePageNumber = false,
	hideTags = false,
	// onRender = () => { },
	// onClickTable = () => { },
	// onDeleteTable = () => { },
	// onUpdateTable = () => { },
	onCreateTable = () => { },
	...props
}: Props) {

	const [ isDrawEnabled, setIsDrawEnabled ] = useState(false)

	function handleLayerContextMenu(e: KonvaEventObject<PointerEvent>) {
		LayerContextMenu({
			left: e.evt.clientX,
			top: e.evt.clientY,
			onEnableDraw: () => setIsDrawEnabled(true)
		})
	}

	function handleCreateTable(table: IServerTable) {
		setIsDrawEnabled(false)
		onCreateTable(table)
	}

	useGlobalKeyDown(e => {
		if (e.key === 'Control')
			setIsDrawEnabled(true)
	})

	useGlobalKeyUp(e => {
		if (e.key === 'Control')
			setIsDrawEnabled(false)
	})

	return (
		<div className={`pdf_page ${readOnly ? 'readonly' : ''}`}>
			{!readOnly && (
				<button onClick={() => setIsDrawEnabled(true)}>
					New Table
				</button>
			)}
			<PDFPageCanvas
				pageNumber={pageNumber}
				onLayerContextMenu={handleLayerContextMenu}
				enableDraw={isDrawEnabled}
				onCreateTable={handleCreateTable}
				{...props}
			/>
			{!hidePageNumber && (
				<div>Page {pageNumber}</div>
			)}
		</div>
	)
}

export default PDFPage;