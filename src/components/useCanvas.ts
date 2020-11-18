import { IDocumentProxy } from './PDFDocument';
import { useState, useEffect, useRef } from 'react';
import { useDebouncedState } from 'src/hooks'
import { usePDFContext } from 'src/components.old/PDFDocument'

function useCanvas(
	pageNumber: number,
	scale: number,
	isInLoadZone: boolean,
	documentProxy: IDocumentProxy,
	debounce: number
) {

	const [ canvas, setCanvas ] = useState<HTMLCanvasElement>()
	const [ pageNumberDebounced, setPageNumberDebounced ] = useDebouncedState(pageNumber, debounce)
	const isLoadedRef = useRef(false)

	function onPageNumberChange() {
		setPageNumberDebounced(pageNumber)
		setCanvas(undefined)
	}

	function onPageDebouncedChange() {
		!isLoadedRef.current && isInLoadZone && documentProxy
			.getPage(pageNumberDebounced)
			.then((pageProxy: any) => {
				const newCanvas = document.createElement('canvas')
				newCanvas.width = pageProxy.view[ 2 ]
				newCanvas.height = pageProxy.view[ 3 ]
				const canvasContext = newCanvas.getContext('2d') as CanvasRenderingContext2D;
				const viewport = pageProxy.getViewport({ scale: 1 })
				const renderTask = pageProxy.render({ canvasContext, viewport });

				return renderTask.promise
					.then((e: any) => {
						setCanvas(newCanvas)
						isLoadedRef.current = true
					})
					.catch(console.log)
			})
			.catch(console.log)
	}

	useEffect(onPageNumberChange, [ pageNumber ]) //eslint-disable-line
	useEffect(onPageDebouncedChange, [ pageNumberDebounced, isInLoadZone, documentProxy ])

	return [ canvas, documentProxy.pageWidth * scale, documentProxy.pageHeight * scale ] as const
}

export default useCanvas;