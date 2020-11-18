import { KonvaEventObject } from 'konva/types/Node'
import { Rect as RectType } from 'konva/types/shapes/Rect'
import { Transformer as TransformerType } from 'konva/types/shapes/Transformer'
import React, { useEffect, useRef, useState } from 'react'
import { KonvaNodeComponent, Rect, Transformer } from 'react-konva'
import useBindTableToLayerBorders from './useBindTableToLayerBorders'
import { updateTableBounds } from './helpers'
import { toServerTable } from 'src/components.old/helpers'
import { useGlobalClick, useUpdatedState } from 'src/hooks'

export interface ITableStyles {
	stroke?: string;
	fill?: string;
	strokeWidth?: number;
}

export interface IAllTableStyles {
	drawing?: ITableStyles
	not_verified?: ITableStyles
	rejected?: ITableStyles
	verified?: ITableStyles
	completed?: ITableStyles
}

export enum TABLE_STATUS {
	NOT_VERIFIED,
	VERIFIED,
	REJECTED
}

export interface ILibraryTable {
	id: number,
	x: number,
	y: number,
	width: number,
	height: number,
	page: number,
	reviewStatus: TABLE_STATUS,
	status: TABLE_STATUS,
	userDefined: boolean
}

export interface IServerTable {
	id: number,
	maxX: number,
	maxY: number,
	minX: number,
	minY: number,
	page: number,
	reviewStatus: TABLE_STATUS,
	status: TABLE_STATUS,
	userDefined: boolean
}

interface Props {
	table: ILibraryTable,
	scale: number,
	tableStyles: ITableStyles,
	canvasWidth: number
	canvasHeight: number
	readOnly: boolean
	minSize?: number
	onTableUpdate: (table: IServerTable) => void
}

const Table = ({
	table,
	scale,
	tableStyles,
	canvasWidth,
	canvasHeight,
	readOnly,
	minSize = 15,
	onTableUpdate,
}: Props) => {

	const rectRef = useRef<RectType>(null)
	const trRef = useRef<TransformerType>(null)
	const lastClickInsideTimeStamp = useRef(0)

	const [ isSelected, setIsSelected ] = useState(false)

	const { boundBoxFunc, dragBoundFunc } = useBindTableToLayerBorders(rectRef.current, canvasWidth, canvasHeight)

	useGlobalClick((e: any) => {
		const isClickInside = lastClickInsideTimeStamp.current === e.timeStamp
		const isInButton = !!e.target.closest('button')
		const isInDocument = !!e.target.closest('.react-pdf__Document')

		if (isClickInside)
			return setIsSelected(true)
		if (isInDocument && !isInButton)
			setIsSelected(false)
	})

	function handleClick(e: KonvaEventObject<MouseEvent>) {
		lastClickInsideTimeStamp.current = e.evt.timeStamp
	}

	function handleDragEnd(e: KonvaEventObject<MouseEvent>) {
		lastClickInsideTimeStamp.current = e.evt.timeStamp
	}

	function handleTransformEnd(e: KonvaEventObject<MouseEvent>) {
		lastClickInsideTimeStamp.current = e.evt.timeStamp
		const newTable = updateTableBounds.onTransformEnd(rectRef.current, table, minSize)
		onTableUpdate(toServerTable(newTable, scale))
		rectRef.current!.scaleX(1)
		rectRef.current!.scaleY(1)
		rectRef.current!.rotation(0)
	}

	return (
		<>
			<Rect
				ref={rectRef}
				x={table.x}
				y={table.y}
				width={table.width}
				height={table.height}
				className='test'
				strokeScaleEnabled={false}
				dash={[ 3, 3 ]}
				onClick={handleClick}
				onTransformEnd={handleTransformEnd}
				onDragEnd={handleDragEnd}
				// onMouseEnter={handleMouseEnter}
				// onMouseLeave={handleMouseLeave}
				// onContextMenu={handleContextMenu}
				// stroke={styles()!.stroke}
				// fill={styles()!.fill}
				// strokeWidth={styles()!.strokeWidth! + ((isHovered || isSelected) && !disabled ? 1 : 0)}
				dragBoundFunc={dragBoundFunc}
				draggable={!readOnly && isSelected}
				stroke={tableStyles.stroke}
				fill={tableStyles.fill}
				strokeWidth={tableStyles.strokeWidth}
			/>
			{/* {(isContextMenuOpen || isSelected) && !disabled && table.status !== TABLE_STATUS.REJECTED && ( */}
			{isSelected && rectRef.current && (
				<Transformer
					ref={trRef}
					node={rectRef.current}
					rotateEnabled={false}
					keepRatio={false}
					boundBoxFunc={boundBoxFunc}
					borderStroke='transparent'
					anchorSize={12}
					anchorFill={tableStyles.stroke}
					anchorStrokeWidth={2}
					anchorStroke='white'
					ignoreStroke
					onClick={e => { lastClickInsideTimeStamp.current = e.evt.timeStamp }}
				// onMouseEnter={handleMouseEnter}
				// onMouseLeave={handleMouseLeave}
				/>
			)}
			{/* )} */}
		</>
	)
}

export default Table