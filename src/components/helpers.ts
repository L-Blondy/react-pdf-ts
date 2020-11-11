import { IServerTable, ILibraryTable } from 'src/components/Table';

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

const consoleWarn = console.warn

export const disableWarnings = () => {
	console.warn = () => null
}

export const enableWarnings = () => {
	console.warn = consoleWarn
}