import React, { createRef } from 'react'
import { IDocumentProxy } from './PDFDocument'
import Canvas from './Canvas'
import { PagePropsFromDocument } from './PDFDocument'
import { ILibraryTable, IServerTable } from 'src/components.old/Table'
import { toLibraryTables } from 'src/components.old/helpers'
import areDeepEqual from 'react-fast-compare'

interface State {
	isInLoadZone: boolean
}

interface PageProps extends PagePropsFromDocument {
	scale: number
	tables?: IServerTable[]
	readOnly?: boolean
	tableMinSize?: number
	onTableUpdate: (table: IServerTable) => void
}

class PDFPage extends React.Component<PageProps> {

	private pageRef = createRef<HTMLDivElement>()

	state: State = {
		isInLoadZone: false,
	}

	componentDidMount() {

		const callback: IntersectionObserverCallback = (entries) => {
			entries.forEach(e => {
				e.intersectionRatio > 0
					? this.setState({ isInLoadZone: true })
					: this.setState({ isInLoadZone: false })
			})
		}

		const options = {
			rootMargin: '500px 0px 500px 0px',
			root: document.querySelector('.app')
		}

		new IntersectionObserver(callback, options).observe(this.pageRef.current!)
	}

	shouldComponentUpdate(nextProps: PageProps, nextState: State) {
		// const prevState = this.state
		const prevProps = this.props

		const HaveTablesChanged = !areDeepEqual(prevProps.tables, nextProps.tables)
		const hasScaleChanged = prevProps.scale !== nextProps.scale
		const hasDocumentProxyChanged = prevProps.documentProxy !== nextProps.documentProxy
		const hasGetTableStylesChanged = prevProps.getTableStyles !== nextProps.getTableStyles
		const hasPageNumberChanged = prevProps.pageNumber !== nextProps.pageNumber
		const hasReadOnlyChanged = prevProps.readOnly !== nextProps.readOnly


		// console.log('HaveTablesChanged', HaveTablesChanged)
		// console.log('hasScaleChanged', hasScaleChanged)
		// console.log('hasDocumentProxyChanged', hasDocumentProxyChanged)
		// console.log('hasGetTableStylesChanged', hasGetTableStylesChanged)
		// console.log('hasGetTableStylesChanged', hasGetTableStylesChanged)
		// console.log('hasKeyBindingChanged', hasKeyBindingChanged)
		// console.log('hasTimeStampChanged', hasTimeStampChanged)
		return (hasDocumentProxyChanged || nextState.isInLoadZone) && (
			HaveTablesChanged ||
			hasScaleChanged ||
			hasGetTableStylesChanged ||
			hasPageNumberChanged ||
			hasReadOnlyChanged
		)
	}

	componentDidUpdate(prevProps: PageProps) {
		console.log(this.props.pageNumber + ' has rerendered')
	}

	render() {
		const { documentProxy, pageNumber, getTableStyles, scale, readOnly, tableMinSize, tables: serverTables, onTableUpdate } = this.props
		const tables = toLibraryTables(serverTables || [], scale)

		return (
			<div ref={this.pageRef}>
				<div>Taglist</div>
				<Canvas
					tables={tables}
					getTableStyles={getTableStyles}
					scale={scale}
					pageNumber={this.props.pageNumber}
					isInLoadZone={this.state.isInLoadZone}
					documentProxy={documentProxy}
					readOnly={readOnly || false}
					tableMinSize={tableMinSize}
					onTableUpdate={onTableUpdate}
				/>
				<div>Page {pageNumber}</div>
			</div>
		)
	}
}

export default PDFPage