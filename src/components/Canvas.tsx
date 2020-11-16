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

interface Props {
	pageNumber: number
	scale: number
	isVisible: boolean
	isInLoadZone: boolean
	documentProxy: IDocumentProxy
}

function Canvas({
	pageNumber,
	scale,
	isVisible,
	documentProxy,
	isInLoadZone
}: Props) {

	const [ canvas, width, height ] = useCanvas(pageNumber, scale, isInLoadZone, documentProxy, 350)

	return (
		<Stage height={height} width={width}>

			<Layer>

				<Image
					image={canvas}
					scale={{ x: scale, y: scale }}
				/>

			</Layer>

		</Stage>
	)
}

export default Canvas;