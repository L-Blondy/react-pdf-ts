import { useState, useEffect, useRef } from 'react';
import { useGetIsMounted } from './'

const useDebouncedState = <T extends unknown>(initialValue: T, ms: number) => {

	const [ state, setState ] = useState(initialValue)
	const isMounted = useGetIsMounted()
	const cancelTokenRef = useRef<NodeJS.Timeout>()

	function set(newValue: T) {
		cancelTokenRef.current && clearTimeout(cancelTokenRef.current)
		cancelTokenRef.current = setTimeout(() => {
			isMounted() && setState(newValue)
		}, ms)
	}

	return [ state, set ] as [ T, React.Dispatch<React.SetStateAction<T>> ]
}

export default useDebouncedState;