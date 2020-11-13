import './PDFPage.scss'
import React from 'react';
import PDFPageCanvas, { IPDFPageCanvasProps } from './PDFPageCanvas'
import { KonvaEventObject } from 'konva/types/Node';
import { LayerContextMenu } from './'
import { IServerTable } from './Table';
import { areDeepEqual } from 'src/utils'

interface IPDFPageState {
	isDrawEnabled: boolean
	isVisible: boolean
}

export interface IPDFPageProps extends Omit<IPDFPageCanvasProps, 'enableDraw'> {
	readOnly?: boolean
	hidePageNumber?: boolean
	hideTags?: boolean
}

class PDFPage extends React.Component<IPDFPageProps, IPDFPageState>{

	static defaultProps: Partial<IPDFPageProps> = {
		readOnly: false,
		hidePageNumber: false,
		hideTags: false,
		onCreateTable: () => { },
	}

	state: IPDFPageState = {
		isDrawEnabled: false,
		isVisible: false
	}

	shouldComponentUpdate(nextProps: IPDFPageProps, nextState: IPDFPageState) {
		return nextState.isVisible && (
			!areDeepEqual(this.props, nextProps) ||
			!areDeepEqual(this.state, nextState)
		)
	}

	handleLayerContextMenu = (e: KonvaEventObject<PointerEvent>) => {
		LayerContextMenu({
			left: e.evt.clientX,
			top: e.evt.clientY,
			onEnableDraw: () => this.setState({ isDrawEnabled: true })
		})
	}

	handleCreateTable = (table: IServerTable) => {
		this.setState({ isDrawEnabled: true })
		this.props.onCreateTable!(table)
	}

	render() {
		const { readOnly, pageNumber, hidePageNumber } = this.props
		console.log('PAGE RENDERS')

		return (
			<div className={`pdf_page ${readOnly ? 'readonly' : ''}`}>
				{!readOnly && (
					<button onClick={() => this.setState({ isDrawEnabled: true })}>
						New Table
					</button>
				)}
				<PDFPageCanvas
					{...this.props}
					onVisibilityChange={isVisible => {
						console.log('FROM PAGE:', isVisible, 'scale:', this.props.scale)
						this.setState({ isVisible })
					}}
					pageNumber={pageNumber}
					onLayerContextMenu={this.handleLayerContextMenu}
					enableDraw={this.state.isDrawEnabled}
					onCreateTable={this.handleCreateTable}
				/>
				{!hidePageNumber && (
					<div>Page {pageNumber}</div>
				)}
			</div>
		)
	}
}

export default PDFPage


// function PDFPageOld({
// 	pageNumber,
// 	readOnly = false,
// 	hidePageNumber = false,
// 	hideTags = false,
// 	onCreateTable = () => { },
// 	...props
// }: IPDFPageProps) {
// 	console.log('PAGE RERENDER')

// 	const [ isDrawEnabled, setIsDrawEnabled ] = useState(false)
// 	const [ isMouseOverCanvas, setIsMouseOverCanvas ] = useState(false)

// 	function handleLayerContextMenu(e: KonvaEventObject<PointerEvent>) {
// 		LayerContextMenu({
// 			left: e.evt.clientX,
// 			top: e.evt.clientY,
// 			onEnableDraw: () => setIsDrawEnabled(true)
// 		})
// 	}

// 	function handleCreateTable(table: IServerTable) {
// 		setIsDrawEnabled(false)
// 		onCreateTable(table)
// 	}

// 	useGlobalKeyDown(e => {
// 		if (e.key === 'Control')
// 			setIsDrawEnabled(true)
// 	})

// 	useGlobalKeyUp(e => {
// 		if (e.key === 'Control')
// 			setIsDrawEnabled(false)
// 	})

// 	return (
// 		<div className={`pdf_page ${readOnly ? 'readonly' : ''}`}>
// 			{!readOnly && (
// 				<button onClick={() => setIsDrawEnabled(true)}>
// 					New Table
// 				</button>
// 			)}
// 			<PDFPageCanvas
// 				onMouseEnter={() => setIsMouseOverCanvas(true)}
// 				onMouseLeave={() => setIsMouseOverCanvas(false)}
// 				pageNumber={pageNumber}
// 				onLayerContextMenu={handleLayerContextMenu}
// 				enableDraw={isDrawEnabled}
// 				onCreateTable={handleCreateTable}
// 				{...props}
// 			/>
// 			{!hidePageNumber && (
// 				<div>Page {pageNumber}</div>
// 			)}
// 		</div>
// 	)
// }



// export default React.memo(PDFPage, arePropsEqualDeep);