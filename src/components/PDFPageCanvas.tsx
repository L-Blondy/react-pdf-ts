import './PDFPageCanvas.scss'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva'
import { useUpdatedRef, useIsVisible } from 'src/hooks'
import { PDFPageCanvasPreloader, Table, DrawTable, usePDFPageCanvas, useMouseCursorEffect } from './'
import { ILibraryTable, IServerTable, TABLE_STATUS } from './Table'
import { ITableBounds } from './DrawTable'
import { toLibraryTables, toServerTable } from './helpers'
import { usePDFContext } from './PDFDocument'
import { KonvaEventObject } from 'konva/types/Node';

export interface IPDFPageCanvasProps {
	pageNumber: number,
	scale?: number,
	debounceRenderMs?: number
	tables?: IServerTable[]
	onClickTable?: ({ pageNumber, tableIndex }: { pageNumber: number, tableIndex: number }) => void
	minTableSize?: number
	enableDraw?: boolean
	onRender?: (canvas: HTMLCanvasElement) => void
	onDeleteTable?: (table: IServerTable) => void
	onUpdateTable?: (table: IServerTable) => void
	onCreateTable?: (table: IServerTable) => void
	onLayerContextMenu?: (e: KonvaEventObject<PointerEvent>) => void
	onClick?: (e: React.MouseEvent) => void
	onMouseEnter?: (e: React.MouseEvent) => void
	onMouseLeave?: (e: React.MouseEvent) => void
	onVisibilityChange?: (isVisible: boolean) => void
}

const PDFPageCanvas = ({
	pageNumber,
	scale = 1,
	debounceRenderMs = 500,
	tables: ServerTables = [],
	minTableSize = 10,
	enableDraw = false,
	onRender = () => { },
	onClickTable = () => { },
	onDeleteTable = () => { },
	onUpdateTable = () => { },
	onCreateTable = () => { },
	onLayerContextMenu = () => { },
	onClick = () => { },
	onMouseEnter = () => { },
	onMouseLeave = () => { },
	onVisibilityChange = () => { }
}: IPDFPageCanvasProps) => {

	const layerRef = useRef<HTMLCanvasElement | null>(null)
	const onRenderRef = useUpdatedRef(onRender)
	const onVisibilityChangeRef = useUpdatedRef(onVisibilityChange)
	const shouldLoadCanvas = useIsVisible(layerRef, { margin: '500px' })
	const isVisible = useIsVisible(layerRef)
	const [ hoverTargetName, setHoverTargetName ] = useState('')
	const { tableStyles } = usePDFContext()
	const [ canvas, pageWidth, pageHeight ] = usePDFPageCanvas(pageNumber, debounceRenderMs, scale, shouldLoadCanvas)
	const [ tables, setTables ] = useState<ILibraryTable[]>(toLibraryTables(ServerTables, scale))

	useMouseCursorEffect(hoverTargetName, enableDraw, layerRef)
	useEffect(() => setTables(toLibraryTables(ServerTables, scale)), [ ServerTables, scale ])
	useEffect(() => canvas && onRenderRef.current(canvas), [ canvas, onRenderRef ])
	useEffect(() => onVisibilityChangeRef.current(shouldLoadCanvas), [ shouldLoadCanvas, onVisibilityChangeRef ])

	function updateTable(table: ILibraryTable) {
		setTables(tables.map(t => t.id === table.id ? table : t))
		onUpdateTable(toServerTable(table, scale))
	}

	function deleteTable(table: ILibraryTable) {
		setTables(tables.filter(t => t.id !== table.id))
		onDeleteTable(toServerTable(table, scale))
	}

	function createTable(tableBounds: ITableBounds | null) {
		const isTooSmall = !tableBounds
		const newTable: ILibraryTable = {
			...tableBounds!,
			id: Math.random(),
			page: pageNumber,
			status: TABLE_STATUS.VERIFIED,
			reviewStatus: TABLE_STATUS.NOT_VERIFIED,
			userDefined: true
		}
		!isTooSmall && setTables([ ...tables, newTable ])
		onCreateTable(toServerTable(newTable, scale))
	}

	function handleLayerContextMenu(e: KonvaEventObject<PointerEvent>) {
		e.evt.preventDefault()
		if (e.target.constructor.name !== 'Image') return
		onLayerContextMenu(e)
	}

	return (
		<div
			className={`stage_container ${canvas ? 'loaded' : ''}`}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave} >

			<PDFPageCanvasPreloader when={!canvas && isVisible} />

			<Stage height={pageHeight} width={pageWidth}>

				<Layer
					ref={l => { layerRef.current = l?.canvas._canvas || null }}
					onContextMenu={handleLayerContextMenu}>

					<Image
						image={canvas}
						scale={{ x: scale, y: scale }}
						onMouseEnter={() => setHoverTargetName('image')}
					/>

					{!!canvas && tables.map((tableData, tableIndex) => (
						<Table
							layerRef={layerRef}
							table={tableData}
							key={`table-${pageNumber}-${tableIndex}`}
							onClick={() => onClickTable({ pageNumber, tableIndex })}
							onDragEnd={updateTable}
							onTransformEnd={updateTable}
							onTableStatusChange={updateTable}
							onDelete={deleteTable}
							minSize={minTableSize}
							disabled={enableDraw}
							tableStyles={tableStyles}
							onMouseEnter={setHoverTargetName}
						/>
					))}

					<DrawTable
						when={enableDraw}
						layerRef={layerRef}
						onDrawEnd={createTable}
						minSize={minTableSize}
						stroke={tableStyles.drawing!.stroke}
						fill={tableStyles.drawing!.fill}
						strokeWidth={tableStyles.drawing!.strokeWidth}
					/>
				</Layer>

			</Stage>
		</div>
	)
}

export default PDFPageCanvas;

