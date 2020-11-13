import React, { createContext, useContext, useState } from 'react';
import { useGlobalKeyDown, useGlobalKeyUp } from 'src/hooks'


export const KeyDownListCtx = createContext<string[]>([])

export const useKeyDownList = () => useContext(KeyDownListCtx)

const KeyDownListCtxProvider: React.FC = ({ children }) => {

	const [ keyDownList, setKeyDownList ] = useState<string[]>([])

	useGlobalKeyDown(e => {
		console.log('KEYDOWN:', e.key)
		setKeyDownList([ e.key ])
	})

	useGlobalKeyUp(e => {
		setKeyDownList([])
	})

	return (
		<KeyDownListCtx.Provider value={keyDownList}>
			{children}
		</KeyDownListCtx.Provider>
	)
}

interface AdditionalProps {
	keyDownList?: string[]
}

interface Props extends AdditionalProps { }

export const withKeyDownList = <T extends AdditionalProps>(Component: React.ComponentType<T>) => {

	return (props: T) => (
		<KeyDownListCtx.Consumer>
			{(keyDownList) => <Component {...props} keyDownList={keyDownList} />}
		</KeyDownListCtx.Consumer>
	)
}

export default KeyDownListCtxProvider;