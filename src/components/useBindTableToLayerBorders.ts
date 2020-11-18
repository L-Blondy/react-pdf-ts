import { ITableBounds } from './DrawTable'

type KonvaRectObject = any

interface Box extends ITableBounds {
	rotation: number
}

function useBindRectToLayerBorders(
	rect: KonvaRectObject | null,
	canvasWidth: number,
	canvasHeight: number
) {

	function boundBoxFunc(oldBox: Box, box: Box) {
		if (box.rotation !== 0) {
			return {
				rotation: box.rotation,
				x: Math.min(box.x, canvasWidth - 1),
				y: Math.min(box.y, canvasHeight - 1),
				width: box.x < canvasWidth - 1
					? Math.min(box.width, box.x - 1)
					: box.width - (box.x - canvasWidth) - 1,
				height: box.y < canvasHeight - 1
					? Math.min(box.height, box.y - 1)
					: box.height - (box.y - canvasHeight) - 1,
			}
		}
		return {
			rotation: box.rotation,
			x: Math.max(1, box.x),
			y: Math.max(1, box.y),
			width: box.x < 1
				? box.width + box.x - 1
				: Math.min(box.width, canvasWidth - box.x - 1),
			height: box.y < 1
				? box.height + box.y - 1
				: Math.min(box.height, canvasHeight - box.y - 1),
		}
	}

	function dragBoundFunc({ x, y }: { x: number, y: number }) {
		if (!rect)
			return { x, y }

		return {
			x: x < 1
				? 1
				: Math.min(canvasWidth - rect.width() - 2, x),
			y: y < 1
				? 1
				: Math.min(canvasHeight - rect.height() - 2, y),
		}
	}

	return {
		boundBoxFunc,
		dragBoundFunc
	}
}

export default useBindRectToLayerBorders