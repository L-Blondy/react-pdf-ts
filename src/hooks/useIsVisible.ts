import { useState, useRef, useEffect } from 'react'

function useIsVisible(layerRef: React.MutableRefObject<HTMLCanvasElement | null>) {
	const [ isVisible, setIsVisible ] = useState(false)

	const IORef = useRef(new IntersectionObserver(entries => {
		entries.forEach(e => {
			if (e.intersectionRatio === 0) return
			setIsVisible(true)
			IORef.current.unobserve(layerRef.current!)
		})
	}))

	useEffect(() => {
		if (!layerRef.current) return
		IORef.current.observe(layerRef.current)
	}, [ layerRef ])

	return isVisible
}

export default useIsVisible