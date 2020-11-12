import { useRef, useEffect, useCallback } from 'react';

const useIsMounted = () => {
	const mountedRef = useRef<boolean>(false);
	const get = useCallback(() => mountedRef.current, []);

	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	return get;
}

export default useIsMounted;