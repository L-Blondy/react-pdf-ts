import React, { useState, useEffect } from 'react';
import { Rect } from 'react-konva';
import { useThrottle, useUpdatedRef, useGlobalMouseDown, useGlobalMouseMove, useGlobalMouseUp } from 'src/hooks'

export interface ITableBounds {
	x: number
	y: number
	width: number
	height: number
}

interface Props {
	layerRef: React.MutableRefObject<HTMLCanvasElement | null>
	when: boolean
	onDrawEnd: (table: ITableBounds | null) => void
	minSize?: number
	strokeWidth?: number
	stroke?: string
	fill?: string
}

function DrawTable({
	layerRef,
	when,
	onDrawEnd,
	minSize = 5,
	strokeWidth = 2,
	stroke = '#87cefa90',
	fill = '#87cefa40',
}: Props) {

	const [ isDrawing, setIsDrawing ] = useState(false)
	const [ tableCoordinates, setTableCoordinates ] = useState<ITableBounds | null>(null)
	const onDrawEndRef = useUpdatedRef(onDrawEnd)

	useEffect(() => {
		setTableCoordinates(null)
	}, [ when ])

	const onMouseDown = (e: any) => {
		if (!when || layerRef.current !== e.target.closest('canvas')) return
		setIsDrawing(true)
		setTableCoordinates({
			x: e.layerX,
			y: e.layerY,
			width: 0,
			height: 0
		})
	}

	const [ onMouseMove ] = useThrottle((e: MouseEvent) => {
		const cvs = layerRef.current
		if (!when || !isDrawing || !tableCoordinates || !cvs) return
		const layerX = e.clientX - cvs.getBoundingClientRect().left
		const layerY = e.clientY - cvs.getBoundingClientRect().top
		const { x, y } = tableCoordinates
		let width = Math.min(cvs.clientWidth - tableCoordinates.x - 1, layerX - tableCoordinates.x)
		let height = Math.min(cvs.clientHeight - tableCoordinates.y - 1, layerY - tableCoordinates.y)
		width = Math.max(width, 1 - tableCoordinates.x)
		height = Math.max(height, 1 - tableCoordinates.y)
		setTableCoordinates({ x, y, width, height })
	}, 30)

	const onMouseUp = (e: MouseEvent) => {
		const cvs = layerRef.current
		if (!when || !isDrawing || !tableCoordinates || !cvs) return
		const layerX = e.clientX - cvs.getBoundingClientRect().left
		const layerY = e.clientY - cvs.getBoundingClientRect().top

		let x = Math.min(tableCoordinates.x, layerX)
		let y = Math.min(tableCoordinates.y, layerY)
		let width = Math.abs(layerX - tableCoordinates.x)
		let height = Math.abs(layerY - tableCoordinates.y)
		x = Math.max(1, x)
		y = Math.max(1, y)
		width = Math.min(width, width + layerX, cvs.clientWidth - x - 2)
		height = Math.min(height, height + layerY, cvs.clientHeight - y - 2)

		setIsDrawing(false)
		// setTableCoordinates(null)

		if (width > minSize && height > minSize)
			onDrawEndRef.current({ x, y, width, height, })
		else
			onDrawEndRef.current(null)
	}

	useGlobalMouseDown(onMouseDown)
	useGlobalMouseMove(onMouseMove)
	useGlobalMouseUp(onMouseUp)

	return !when || !isDrawing
		? null
		: (
			<Rect
				{...tableCoordinates}
				stroke={stroke}
				fill={fill}
				strokeWidth={strokeWidth}
				dash={[ strokeWidth, strokeWidth ]}
				strokeScaleEnabled={false}
			/>
		)
}

export default DrawTable;