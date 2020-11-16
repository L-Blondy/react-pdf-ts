
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { KonvaEventObject } from 'konva/types/Node';
import { Rect, Transformer, } from 'react-konva'
import { useGlobalKeyDown, useGlobalClick, useGlobalContextMenu, useUpdatedRef } from 'src/hooks'
import { TableContextMenu, useBindRectToLayerBorders } from '.'
import { enableWarnings, disableWarnings } from './helpers'

export interface ITableStyles {
	drawing?: {
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
	};
	not_verified?: {
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
	};
	rejected?: {
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
	};
	verified?: {
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
	};
	completed?: {
		stroke?: string;
		fill?: string;
		strokeWidth?: number;
	};
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
	table: ILibraryTable
	layerRef: React.MutableRefObject<HTMLCanvasElement | null>
	disabled: boolean
	tableStyles: ITableStyles
	keyDownList?: string[]
	onClick?: () => void
	onDragEnd?: (table: ILibraryTable) => void
	onTransformEnd?: (table: ILibraryTable) => void
	onTableStatusChange?: (table: ILibraryTable) => void
	onDelete?: (table: ILibraryTable) => void
	onMouseEnter?: (targetName: string) => void
	minSize?: number
}

function Table({
	table,
	layerRef,
	disabled,
	tableStyles,
	keyDownList = [],
	onClick = () => { },
	onDragEnd = () => { },
	onTransformEnd = () => { },
	onDelete = () => { },
	onTableStatusChange = () => { },
	onMouseEnter = () => { },
	minSize = 5,
}: Props) {

	const trRef = useRef<any>(null)
	const rectRef = useRef<any>(null)
	const lastClickInsideTimeStamp = useRef(0)
	const lastContextMenuTimeStamp = useRef(0)
	const lastTransformOrDragEndTimeStamp = useRef(0)
	const prevKeyDownList = useRef(keyDownList)
	const onMouseEnterRef = useUpdatedRef(onMouseEnter)
	const onDeleteRef = useUpdatedRef(onDelete)
	const tableRef = useUpdatedRef(table)
	const [ isSelected, setIsSelected ] = useState(false)
	const [ isHovered, setIsHovered ] = useState(false)
	const [ isContextMenuOpen, setIsContextMenuOpen ] = useState(false)
	const { boundBoxFunc, dragBoundFunc } = useBindRectToLayerBorders(layerRef.current, rectRef.current)

	useEffect(() => setIsSelected(false), [ disabled ])

	//Allows only one table to be selected on the whole document on click
	useGlobalClick(e => {
		disableWarnings() //expect Konva deprecation warning
		const isClickInside = e.timeStamp === lastClickInsideTimeStamp.current
		const isTransformOrDragEnd = e.timeStamp === lastTransformOrDragEndTimeStamp.current
		if (isContextMenuOpen) return setIsSelected(true)
		if (!isTransformOrDragEnd && !isClickInside) return setIsSelected(false)
		setIsSelected(true)
		onClick()
		enableWarnings() //restore warnings
	})

	//deselect tables on ContextMenu, selects the targeted table
	useGlobalContextMenu(e => {
		disableWarnings() //expect Konva deprecation warning
		const isTableContextMenu = e.timeStamp === lastContextMenuTimeStamp.current
		if (!isTableContextMenu || table.status === TABLE_STATUS.REJECTED) return setIsSelected(false)
		enableWarnings() //restore warnings
	})

	//Delete Table with Delete || Backspace keys
	useEffect(() => {
		const wasKeyDownListEmpty = prevKeyDownList.current.length === 0
		const isDeleteKeyDownAlone = keyDownList.length === 1 && (keyDownList[ 0 ] === 'Backspace' || keyDownList[ 0 ] === 'Delete')
		const shouldDelete = isSelected && wasKeyDownListEmpty && isDeleteKeyDownAlone
		shouldDelete && onDeleteRef.current(tableRef.current)
		prevKeyDownList.current = keyDownList
	}, [ keyDownList ]) //eslint-disable-line

	function handleDragEnd(e: KonvaEventObject<DragEvent>) {
		if (disabled) return
		lastTransformOrDragEndTimeStamp.current = e.evt.timeStamp
		onDragEnd({
			...table,
			x: e.target.x(),
			y: e.target.y(),
		})
	}

	function handleTransformEnd(e: KonvaEventObject<Event>) {
		if (disabled) return
		const rect = rectRef.current

		const x = rect.x()
		const y = rect.y()
		const width = rect.width() * rect.scaleX()
		const height = rect.height() * rect.scaleY()

		rect.rotation()
			? onTransformEnd({
				...table,
				x: x - width,
				y: height > 0 ? y - height : y,
				width: Math.max(minSize, Math.abs(width)),
				height: Math.max(minSize, Math.abs(height))
			})
			: onTransformEnd({
				...table,
				x,
				y: height < 0 ? y + height : y,
				width: Math.max(minSize, Math.abs(width)),
				height: Math.max(minSize, Math.abs(height))
			})

		rect.scaleX(1)
		rect.scaleY(1)
		rect.rotation(0)
		lastTransformOrDragEndTimeStamp.current = e.evt.timeStamp
	}

	function handleContextMenu(e: KonvaEventObject<PointerEvent>) {
		e.evt.preventDefault()
		setIsSelected(true)
		setIsContextMenuOpen(true)
		lastContextMenuTimeStamp.current = e.evt.timeStamp

		TableContextMenu({
			left: e.evt.clientX,
			top: e.evt.clientY,
			table,
			tableStyles,
			onDelete,
			onStatusChange(status: TABLE_STATUS) {
				const hasStatusChanged = status !== table.status
				hasStatusChanged && onTableStatusChange({ ...table, status })
			},
			onClose() {
				setIsContextMenuOpen(false)
			}
		})
	}

	useLayoutEffect(() => {
		if (disabled)
			return
		if (isHovered && isSelected)
			return onMouseEnterRef.current('rect_selected')
		if (isHovered)
			return onMouseEnterRef.current('rect')
	}, [ isHovered, isSelected, disabled, onMouseEnterRef ])

	function handleMouseEnter(e: KonvaEventObject<MouseEvent>) {
		const targetName = e.target.attrs.name || (isSelected ? 'rect_selected' : 'rect')
		targetName.startsWith('rect') && setIsHovered(true)
		onMouseEnter(targetName)

	}

	function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
		const targetName = e.target.attrs.name || 'rect'
		targetName.startsWith('rect') && setIsHovered(false)
		onMouseEnter(targetName)
	}

	function styles() {
		if (table.reviewStatus === TABLE_STATUS.VERIFIED)
			return tableStyles.completed
		if (table.status === TABLE_STATUS.VERIFIED)
			return tableStyles.verified
		if (table.status === TABLE_STATUS.REJECTED)
			return tableStyles.rejected
		return tableStyles.not_verified
	}

	return (
		<>
			<Rect
				x={table.x}
				y={table.y}
				width={table.width}
				height={table.height}
				onClick={e => { lastClickInsideTimeStamp.current = e.evt.timeStamp }}
				className='test'
				ref={rectRef}
				strokeScaleEnabled={false}
				onTransformEnd={handleTransformEnd}
				onDragEnd={handleDragEnd}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onContextMenu={handleContextMenu}
				draggable={!disabled && isSelected}
				stroke={styles()!.stroke}
				fill={styles()!.fill}
				strokeWidth={styles()!.strokeWidth! + ((isHovered || isSelected) && !disabled ? 1 : 0)}
				dragBoundFunc={dragBoundFunc}
				dash={[ 3, 3 ]}
			/>
			{(isContextMenuOpen || isSelected) && !disabled && table.status !== TABLE_STATUS.REJECTED && (
				<Transformer
					node={rectRef.current}
					onClick={e => { lastClickInsideTimeStamp.current = e.evt.timeStamp }}
					ref={trRef}
					rotateEnabled={false}
					keepRatio={false}
					boundBoxFunc={boundBoxFunc}
					borderStroke='transparent'
					anchorSize={12}
					anchorFill={styles()!.stroke}
					anchorStrokeWidth={2}
					anchorStroke='white'
					ignoreStroke
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				/>
			)}
		</>
	)
}

export default Table;