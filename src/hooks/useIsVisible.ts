import { useState, useRef, useEffect } from 'react'

function useIsVisible(layerRef: React.MutableRefObject<HTMLCanvasElement | null>, options?: { margin: string }) {
	const [ isVisible, setIsVisible ] = useState(false)

	const IORef = useRef(new IntersectionObserver(entries => {
		entries.forEach(e => {
			if (e.intersectionRatio === 0) return
			setIsVisible(true)
			IORef.current.unobserve(layerRef.current!)
		})
	}, {
		root: document.querySelector('#root'),
		rootMargin: `0px 0px ${options?.margin || '0px'} 0px`
	}))

	useEffect(() => {
		if (!layerRef.current) return
		IORef.current.observe(layerRef.current)
	}, [ layerRef ])

	return isVisible
}

export default useIsVisible