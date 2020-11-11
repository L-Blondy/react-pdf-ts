import { useEffect, useMemo } from 'react'

export default function createGlobalListener<T extends keyof DocumentEventMap>(eventType: T) {

	const callbacks: { [ key: number ]: (e: DocumentEventMap[ T ]) => void } = {}
	let nextID: number = 0

	document.addEventListener(eventType, (e: DocumentEventMap[ T ]) => {
		Object.values(callbacks).forEach(cb => {
			cb(e)
		})
	})

	return function (callback: (e: DocumentEventMap[ T ]) => void) {

		const id = useMemo(() => (nextID++), [])

		useEffect(() => {
			callbacks[ id ] = callback
			return () => { delete callbacks[ id ] }
		}, [ callback, id ])
	}
}

