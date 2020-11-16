// import './PDFPage.scss'
import React, { useState } from 'react';
// import PDFPageCanvas, { IPDFPageCanvasProps } from './PDFPageCanvas'
// import { KonvaEventObject } from 'konva/types/Node';
// import { LayerContextMenu } from './'
// import { IServerTable } from './Table';
// import { useGlobalKeyDown, useGlobalKeyUp } from 'src/hooks';
// import { arePropsEqualDeep } from 'src/utils'

// export interface IPDFPageProps extends Omit<IPDFPageCanvasProps, 'enableDraw'> {
// 	readOnly?: boolean
// 	hidePageNumber?: boolean
// 	hideTags?: boolean
// }

// function PDFPage({
// 	pageNumber,
// 	readOnly = false,
// 	hidePageNumber = false,
// 	hideTags = false,
// 	onCreateTable = () => { },
// 	...props
// }: IPDFPageProps) {
// 	console.log('PAGE RERENDER')

// 	const [ isDrawEnabled, setIsDrawEnabled ] = useState(false)
// 	const [ isMouseOverCanvas, setIsMouseOverCanvas ] = useState(false)

// 	function handleLayerContextMenu(e: KonvaEventObject<PointerEvent>) {
// 		LayerContextMenu({
// 			left: e.evt.clientX,
// 			top: e.evt.clientY,
// 			onEnableDraw: () => setIsDrawEnabled(true)
// 		})
// 	}

// 	function handleCreateTable(table: IServerTable) {
// 		setIsDrawEnabled(false)
// 		onCreateTable(table)
// 	}

// 	useGlobalKeyDown(e => {
// 		if (e.key === 'Control')
// 			setIsDrawEnabled(true)
// 	})

// 	useGlobalKeyUp(e => {
// 		if (e.key === 'Control')
// 			setIsDrawEnabled(false)
// 	})

// 	return (
// 		<div className={`pdf_page ${readOnly ? 'readonly' : ''}`}>
// 			{!readOnly && (
// 				<button onClick={() => setIsDrawEnabled(true)}>
// 					New Table
// 				</button>
// 			)}
// 			<PDFPageCanvas
// 				onMouseEnter={() => setIsMouseOverCanvas(true)}
// 				onMouseLeave={() => setIsMouseOverCanvas(false)}
// 				pageNumber={pageNumber}
// 				onLayerContextMenu={handleLayerContextMenu}
// 				enableDraw={isDrawEnabled}
// 				onCreateTable={handleCreateTable}
// 				{...props}
// 			/>
// 			{!hidePageNumber && (
// 				<div>Page {pageNumber}</div>
// 			)}
// 		</div>
// 	)
// }



// export default React.memo(PDFPage, arePropsEqualDeep);