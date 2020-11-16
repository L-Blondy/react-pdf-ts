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
			console.log(isValidRef.current)
			if (!isValidRef.current)
				return false
			return JSON.stringify(keys) === JSON.stringify(keyBinding)
		}
	}), [ keyBinding ])

	return KeyBinding
}

export default useKeyBinding