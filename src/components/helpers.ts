import { IServerTable, ILibraryTable } from 'src/components.old/Table';
import { Rect as RectType } from 'konva/types/shapes/Rect'

export const toLibraryTables = (tables: IServerTable[], scale: number): ILibraryTable[] => {
	const dpi = 4.16;

	return tables.map(table => ({
		...table,
		x: table.minX / dpi * scale,
		y: table.minY / dpi * scale,
		width: (table.maxX - table.minX) / dpi * scale,
		height: (table.maxY - table.minY) / dpi * scale,
	}))
}

export const toServerTable = (table: ILibraryTable, scale: number): IServerTable => {
	const dpi = 4.16;

	return {
		...table,
		minX: table.x * dpi / scale,
		minY: table.y * dpi / scale,
		maxX: (table.x + table.width) * dpi / scale,
		maxY: (table.y + table.height) * dpi / scale,
	}
}

export const updateTableBounds = {

	onTransformEnd(rect: RectType | null, table: ILibraryTable, minSize: number) {
		if (!rect) return table

		const x = rect.x()
		const y = rect.y()
		const width = rect.width() * rect.scaleX()
		const height = rect.height() * rect.scaleY()

		return rect.rotation()
			? ({
				...table,
				x: x - width,
				y: height > 0 ? y - height : y,
				width: Math.max(minSize, Math.abs(width)),
				height: Math.max(minSize, Math.abs(height))
			})
			: ({
				...table,
				x,
				y: height < 0 ? y + height : y,
				width: Math.max(minSize, Math.abs(width)),
				height: Math.max(minSize, Math.abs(height))
			})

	}
}

const consoleWarn = console.warn

export const disableWarnings = () => {
	console.warn = () => null
}

export const enableWarnings = () => {
	console.warn = consoleWarn
}