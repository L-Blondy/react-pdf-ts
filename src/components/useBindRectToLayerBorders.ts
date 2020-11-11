import { ITableBounds } from './DrawTable'

type KonvaRectObject = any

interface Box extends ITableBounds {
	rotation: number
}

function useBindRectToLayerBorders(layer: HTMLCanvasElement | null, rect: KonvaRectObject | null) {

	function boundBoxFunc(oldBox: Box, box: Box) {
		if (!layer)
			return box

		if (box.rotation !== 0) {
			return {
				rotation: box.rotation,
				x: Math.min(box.x, layer.width - 1),
				y: Math.min(box.y, layer.height - 1),
				width: box.x < layer.width - 1
					? Math.min(box.width, box.x - 1)
					: box.width - (box.x - layer.width) - 1,
				height: box.y < layer.height - 1
					? Math.min(box.height, box.y - 1)
					: box.height - (box.y - layer.height) - 1,
			}
		}
		return {
			rotation: box.rotation,
			x: Math.max(1, box.x),
			y: Math.max(1, box.y),
			width: box.x < 1
				? box.width + box.x - 1
				: Math.min(box.width, layer.width - box.x - 1),
			height: box.y < 1
				? box.height + box.y - 1
				: Math.min(box.height, layer.height - box.y - 1),
		}
	}

	function dragBoundFunc({ x, y }: { x: number, y: number }) {
		if (!layer || !rect)
			return { x, y }

		return {
			x: x < 1
				? 1
				: Math.min(layer.clientWidth - rect.width() - 2, x),
			y: y < 1
				? 1
				: Math.min(layer.clientHeight - rect.height() - 2, y),
		}
	}

	return {
		boundBoxFunc,
		dragBoundFunc
	}
}

export default useBindRectToLayerBorders