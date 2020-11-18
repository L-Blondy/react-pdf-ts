// import './PDFPageCanvas.scss'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva'
import { useUpdatedRef, useIsVisible } from 'src/hooks'
// import { PDFPageCanvasPreloader, Table, DrawTable, usePDFPageCanvas, useMouseCursorEffect } from '.'
// import { ILibraryTable, IServerTable, TABLE_STATUS } from './Table'
// import { ITableBounds } from './DrawTable'
// import { toLibraryTables, toServerTable } from './helpers'
// import { usePDFContext } from './PDFDocument'
import { KonvaEventObject } from 'konva/types/Node';
import { Page } from 'react-pdf'
import useCanvas from './useCanvas'
import { IDocumentProxy } from './PDFDocument'
import Table, { ILibraryTable, IAllTableStyles, ITableStyles } from './Table'
import { IServerTable } from 'src/components.old/Table';

interface Props {
	pageNumber: number
	scale: number
	isInLoadZone: boolean
	documentProxy: IDocumentProxy
	tables: ILibraryTable[]
	getTableStyles: (table: ILibraryTable) => ITableStyles
	readOnly: boolean
	tableMinSize?: number
	onTableUpdate: (table: IServerTable) => void
}

function Canvas({
	pageNumber,
	scale,
	documentProxy,
	isInLoadZone,
	tables,
	getTableStyles,
	readOnly,
	tableMinSize,
	onTableUpdate,
}: Props) {

	const [ canvas, width, height ] = useCanvas(pageNumber, scale, isInLoadZone, documentProxy, 350)

	console.log('render canvas')
	return (
		<Stage height={height} width={width}>

			<Layer>

				<Image
					image={canvas}
					scale={{ x: scale, y: scale }}
				/>

				{!!canvas && tables.map(table => (
					<Table
						key={`page-${pageNumber}-table-${table.id}`}
						scale={scale}
						table={table}
						tableStyles={getTableStyles(table)}
						canvasWidth={width}
						canvasHeight={height}
						readOnly={readOnly}
						minSize={tableMinSize}
						onTableUpdate={onTableUpdate}
					/>
				))}

			</Layer>

		</Stage>
	)
}

export default React.memo(Canvas);