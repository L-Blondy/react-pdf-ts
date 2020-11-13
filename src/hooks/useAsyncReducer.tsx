import { useReducer } from 'react';

type IAction<Data, Error> = (
	| [ 'pending', boolean ]
	| [ 'error', Error ]
	| [ 'data', Data ]
)

interface IState<Data, Error> {
	'pending': boolean,
	'error': Error | null,
	'data': Data | null
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
				data: null
			}
		case 'data':
			return {
				pending: false,
				error: null,
				data: payload as Data
			}
		case 'error':
			return {
				pending: false,
				error: payload as Error,
				data: null
			}
	}
}

const useAsyncReducer = <Data, Error>(initialState: IState<Data, Error>) => {
	return useReducer(asyncReducer, initialState) as [ IState<Data, Error>, React.Dispatch<IAction<Data, Error>> ]
}

export default useAsyncReducer;