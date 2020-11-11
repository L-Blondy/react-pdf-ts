import { useEffect, useRef } from 'react';

function useMountedEffect(cb: React.EffectCallback, deps: React.DependencyList) {

	const isMountedRef = useRef(false)

	useEffect(() => {
		isMountedRef.current && cb()
	}, deps) //eslint-disable-line

	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
		}
	}, [])
}

export default useMountedEffect;