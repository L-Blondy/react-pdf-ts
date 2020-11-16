import axios from 'axios'
import React, { useState, useEffect, useMemo } from 'react'
import { useAsyncReducer } from 'src/hooks'
import { IDocumentProxy } from './PDFDocument'
import ProgressCircle from './ProgressCircle'
import { PDFPageProxy } from 'react-pdf/dist/Page'

const useLoadDocument = (
	src: string
) => {

	const [ file, seFile ] = useState<string>('')
	const [ state, dispatch ] = useAsyncReducer<IDocumentProxy, any>({
		pending: true,
		error: null,
		data: null,
	})

	useEffect(() => {
		dispatch([ 'pending' ])
		const source = axios.CancelToken.source();

		axios
			.get(src, {
				responseType: 'arraybuffer',
				cancelToken: source.token,
				onDownloadProgress: (e) => dispatch([ 'progress', e.loaded / e.total * 100 | 0 ]),
			})
			.then(res => res.data)
			.then((data: ArrayBuffer) => {
				let binary = '';
				let bytes = new Uint8Array(data);
				for (var i = 0; i < bytes.byteLength; i++) {
					binary += String.fromCharCode(bytes[ i ]);
				}
				const base64 = `data:application/pdf;base64,${window.btoa(binary)}`
				seFile(base64)
			})
			.catch(e => dispatch([ 'error', e ]))

		return () => source.cancel('cancelled request')
	}, [ src ]) //eslint-disable-line

	const preloader = (
		<ProgressCircle
			transitionDuration={0}
			gradient={[ { stop: 0.0, color: '#63cae1' }, { stop: 1, color: '#26a4c0' } ]}
			className='progress_bar_circle'
			progress={state.progress}
			strokeWidth={8}
			hideBall
		/>
	)

	const onLoadSuccess = (documentProxy: any) => {
		documentProxy
			.getPage(1)
			.then((pageProxy: PDFPageProxy) => {
				dispatch([ 'data', {
					...documentProxy,
					getPage: documentProxy.getPage,
					numPages: documentProxy.numPages,
					pageWidth: pageProxy.view[ 2 ],
					pageHeight: pageProxy.view[ 3 ],
				} ]);
			})
	}

	const pageList = useMemo(() => (
		Array.from({ length: state.data?.numPages || 0 }, (_, i) => i + 1)
	), [ state.data?.numPages ])

	const bindToDocument = {
		file,
		onLoadSuccess,
		noData: preloader,
		loading: preloader,
	}

	return { state, pageList, bindToDocument, preloader }
}

export default useLoadDocument


