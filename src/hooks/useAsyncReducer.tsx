import { useReducer } from 'react';

type IAction<Data, Error> = (
	| [ 'pending', boolean?]
	| [ 'error', Error ]
	| [ 'data', Data ]
	| [ 'progress', number ]
)

interface IState<Data, Error> {
	pending: boolean,
	error: Error | null,
	data: Data | null,
	progress: number
}

const asyncReducer = <Data, Error extends any>(
	state: IState<Data, Error>,
	action: IAction<Data, Error>
): IState<Data, Error> => {
	const type = action[ 0 ]
	const payload = action[ 1 ]

	switch (type) {
		case 'pending':
			return {
				pending: true,
				error: null,
				data: null,
				progress: 0
			}
		case 'progress':
			return {
				pending: true,
				error: null,
				data: null,
				progress: payload as number
			}
		case 'data':
			return {
				pending: false,
				error: null,
				data: payload as Data,
				progress: 100
			}
		case 'error':
			return {
				pending: false,
				data: null,
				error: payload as Error,
				progress: 0
			}
	}
}

const defaultState = {
	pending: false,
	error: null,
	data: null,
	progress: 0
}

const useAsyncReducer = <Data, Error>(initialState: Partial<IState<Data, Error>>) => {
	return useReducer(asyncReducer, { ...defaultState, ...initialState }) as [ IState<Data, Error>, React.Dispatch<IAction<Data, Error>> ]
}

export default useAsyncReducer;