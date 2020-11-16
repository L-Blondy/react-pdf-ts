import './PDFPage.scss'
import React from 'react';
import PDFPageCanvas, { IPDFPageCanvasProps } from './PDFPageCanvas'
import { KonvaEventObject } from 'konva/types/Node';
import { LayerContextMenu } from '.'
import { IServerTable } from './Table';
import { areDeepEqual } from 'src/utils'
// import { withKeyDownList } from 'src/context/KeyDownListCtx'

interface IPDFPageState {
	isDrawEnabled: boolean
	isVisible: boolean
}

export interface IPDFPageProps extends Omit<IPDFPageCanvasProps, 'enableDraw'> {
	keyDownList?: string[]
	readOnly?: boolean
	hidePageNumber?: boolean
	hideTags?: boolean
}

class PDFPage extends React.Component<IPDFPageProps, IPDFPageState>{

	static defaultProps: Partial<IPDFPageProps> = {
		keyDownList: [],
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

	componentDidUpdate(prevProps: IPDFPageProps) {
		const prevKeyDownList = prevProps.keyDownList || []
		const currKeyDownList = this.props.keyDownList || []

		const isCtrlKeyDownAlone = currKeyDownList.length === 1 && currKeyDownList[ 0 ] === 'Control'
		const wasCtrlKeyDownAlone = prevKeyDownList.length === 1 && prevKeyDownList[ 0 ] === 'Control'

		if (wasCtrlKeyDownAlone && !isCtrlKeyDownAlone)
			this.setState({ isDrawEnabled: false })
		if (isCtrlKeyDownAlone && !wasCtrlKeyDownAlone)
			this.setState({ isDrawEnabled: true })
	}

	handleLayerContextMenu = (e: KonvaEventObject<PointerEvent>) => {
		LayerContextMenu({
			left: e.evt.clientX,
			top: e.evt.clientY,
			onEnableDraw: () => this.setState({ isDrawEnabled: true })
		})
	}

	handleCreateTable = (table: IServerTable) => {
		this.setState({ isDrawEnabled: !!this.props.keyDownList!.length })
		this.props.onCreateTable!(table)
	}

	render() {
		// console.log('PAGE RENDERS')
		const { readOnly, pageNumber, hidePageNumber, keyDownList } = this.props

		return (
			<div className={`pdf_page ${readOnly ? 'readonly' : ''}`}>
				{!readOnly && (
					<button onClick={() => this.setState({ isDrawEnabled: true })}>
						New Table
					</button>
				)}
				<PDFPageCanvas
					{...this.props}
					keyDownList={keyDownList}
					onVisibilityChange={isVisible => this.setState({ isVisible })}
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