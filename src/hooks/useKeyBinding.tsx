import { useState, useRef, useMemo } from 'react'
import { useGlobalKeyDown, useGlobalKeyUp } from 'src/hooks'

const useKeyBinding = () => {

	const [ keyBinding, setKeyBinding ] = useState<string[]>([])
	const isValidRef = useRef<boolean>(true)

	useGlobalKeyDown(e => {
		isValidRef.current = true
		if (keyBinding.includes(e.key)) return
		setKeyBinding(keyBinding => [ ...keyBinding, e.key ])
	})

	useGlobalKeyUp(e => {
		isValidRef.current = false
		setKeyBinding(keyBinding => keyBinding.filter(key => key !== e.key))
	})

	const KeyBinding = useMemo(() => ({
		matches(...keys: string[]) {
			return isValidRef.current
				? JSON.stringify(keys) === JSON.stringify(keyBinding)
				: false
		}
	}), [ keyBinding ])

	return KeyBinding
}

export default useKeyBinding