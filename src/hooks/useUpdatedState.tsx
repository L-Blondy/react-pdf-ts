import { useState, useEffect } from 'react';


function useUpdateState<T extends unknown>(value: T) {

	const [ state, setState ] = useState<T>(value)

	useEffect(() => {
		setState(value)
	}, [ value ])

	return [ state, setState ] as const
}

export default useUpdateState;