import { useRef, useEffect } from 'react';

const useUpdatedRef = <T extends unknown>(value: T) => {

	const ref = useRef(value)

	useEffect(() => {
		ref.current = value
	})

	return ref
}

export default useUpdatedRef;