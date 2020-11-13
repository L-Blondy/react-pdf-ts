import { useState, useEffect, useRef } from 'react';
import { useDebouncedState } from 'src/hooks'
import { usePDFContext } from 'src/components/PDFDocument'

function usePDFPageCanvas(
	pageNumber: number,
	debounce: number,
	scale: number,
	isVisible: boolean
) {

	const documentProxy = usePDFContext()
	const [ canvas, setCanvas ] = useState<HTMLCanvasElement>()
	const [ pageDebounced, setPageDebounced ] = useDebouncedState(pageNumber, debounce)
	const [ isLoaded, setIsLoaded ] = useState(false)
	const isLoadedRef = useRef(false)

	function onPageNumberChange() {
		setPageDebounced(pageNumber)
		setCanvas(undefined)
	}

	function onPageDebouncedChange() {
		!isLoadedRef.current && isVisible && documentProxy
			// isVisible && documentProxy
			.getPage(pageDebounced)
			.then((pageProxy: any) => {
				const newCanvas = document.createElement('canvas')
				newCanvas.width = pageProxy.view[ 2 ]
				newCanvas.height = pageProxy.view[ 3 ]
				const canvasContext = newCanvas.getContext('2d') as CanvasRenderingContext2D;
				const viewport = pageProxy.getViewport({ scale: 1 })
				const renderTask = pageProxy.render({ canvasContext, viewport });

				renderTask.promise
					.then((e: any) => {
						setCanvas(newCanvas)
						isLoadedRef.current = true
					})
					.catch(console.log)
			})
			.catch(console.log)
	}

	useEffect(onPageNumberChange, [ pageNumber ]) //eslint-disable-line
	useEffect(onPageDebouncedChange, [ pageDebounced, isVisible, documentProxy, setIsLoaded, isLoaded ])

	return [ canvas, documentProxy.pageWidth * scale, documentProxy.pageHeight * scale ] as const
}

export default usePDFPageCanvas;