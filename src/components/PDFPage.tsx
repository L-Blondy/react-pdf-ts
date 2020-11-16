import React, { createRef } from 'react'
import { IDocumentProxy } from './PDFDocument'
import Canvas from './Canvas'
import { PagePropsFromDocument } from './PDFDocument'


interface State {
	isInLoadZone: boolean
	isVisible: boolean
}

interface PageProps extends PagePropsFromDocument {
	scale: number
}

class PDFPage extends React.Component<PageProps> {

	private pageRef = createRef<HTMLDivElement>()

	state: State = {
		isInLoadZone: false,
		isVisible: false
	}

	componentDidMount() {
		const inVisibileZone: IntersectionObserverCallback = (entries) => {
			entries.forEach(e => {
				e.intersectionRatio > 0
					? this.setState({ isVisible: true })
					: this.setState({ isVisible: false })
			})
		}

		const inLoadZone: IntersectionObserverCallback = (entries) => {
			entries.forEach(e => {
				e.intersectionRatio > 0
					? this.setState({ isInLoadZone: true })
					: this.setState({ isInLoadZone: false })
			})
		}

		const inLoadZoneOptions = {
			rootMargin: '500px 0px 500px 0px',
			root: document.querySelector('.app')
		}

		new IntersectionObserver(inVisibileZone).observe(this.pageRef.current!)
		new IntersectionObserver(inLoadZone, inLoadZoneOptions).observe(this.pageRef.current!)
	}

	shouldComponentUpdate(nextProps: PageProps, nextState: State) {
		const prevState = this.state
		const prevProps = this.props
		const hasEnteredLoadZone = !prevState.isInLoadZone && nextState.isInLoadZone
		return (
			hasEnteredLoadZone || nextState.isInLoadZone
		)
	}

	componentDidUpdate(prevProps: PageProps) {
		// console.log(this.pageRef.current)
		// this.state.isInLoadZone && console.log(true)
		// console.log(prevProps.documentProxy === this.props.documentProxy)
	}

	render() {
		const { documentProxy, keyBinding, pageNumber, tableStyles, timeStamp, scale } = this.props

		return (
			<div ref={this.pageRef}>
				<div>Taglist</div>
				<Canvas
					scale={scale}
					pageNumber={this.props.pageNumber}
					isInLoadZone={this.state.isInLoadZone}
					isVisible={this.state.isVisible}
					documentProxy={documentProxy}
				/>
				<div>Page {pageNumber}</div>
			</div>
		)
	}
}

export default PDFPage