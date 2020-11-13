import './PDFDocument.scss'
import axios from 'axios'
import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { Document } from 'react-pdf';
import { PDFPageProxy } from 'react-pdf/dist/Page'
import ProgressCircle from './ProgressCircle'
import { ITableStyles } from 'src/components/Table'

export interface IPDFProxy {
	getPage: (page: number) => Promise<PDFPageProxy>
	numPages: number;
	pageWidth: number;
	pageHeight: number;
	tableStyles: ITableStyles
}

export const PDFContext = createContext<IPDFProxy | null>(null)

export const usePDFContext = () => useContext(PDFContext as React.Context<IPDFProxy>)

const defaultTableStyles: ITableStyles = {
	drawing: {
		stroke: '#87cefa90',
		fill: '#87cefa40',
		strokeWidth: 2
	},
	not_verified: {
		stroke: '#ffbb00',
		fill: '#ffbb0020',
		strokeWidth: 2
	},
	rejected: {
		stroke: '#ff0000',
		fill: '#ff000020',
		strokeWidth: 2
	},
	verified: {
		stroke: '#00ff00',
		fill: '#00ff0020',
		strokeWidth: 2
	},
	completed: {
		stroke: '#00bbff',
		fill: '#00bbff20',
		strokeWidth: 2
	}
}

interface Props {
	file: string,
	children: React.ReactChildren | React.ReactNode | ((pageNumberList: number[]) => React.ReactChildren)
	onLoad?: (PDFProxy: IPDFProxy) => void
	className?: string
	tableStyles?: ITableStyles
}

const PDFDocument = ({
	file,
	children,
	onLoad = () => { },
	className = '',
	tableStyles = {}
}: Props) => {

	const [ PDFProxy, setPDFProxy ] = useState<IPDFProxy | null>(null)
	const [ base64Url, setBase64Url ] = useState<string>('')
	const [ progress, setProgress ] = useState(0)

	useEffect(() => {
		setPDFProxy(null)
		const source = axios.CancelToken.source();

		axios
			.get(file, {
				responseType: 'arraybuffer',
				cancelToken: source.token,
				onDownloadProgress: (e) => setProgress(e.loaded / e.total * 100 | 0),
			})
			.then(res => res.data)
			.then((data: ArrayBuffer) => {
				let binary = '';
				let bytes = new Uint8Array(data);
				for (var i = 0; i < bytes.byteLength; i++) {
					binary += String.fromCharCode(bytes[ i ]);
				}
				const base64 = `data:application/pdf;base64,${window.btoa(binary)}`
				setBase64Url(base64)
			})
			.catch(console.log)

		return () => source.cancel('cancelled request')
	}, [ file ])

	const handleDocumentLoadSuccess = (documentProxy: any) => {
		documentProxy
			.getPage(1)
			.then((pageProxy: PDFPageProxy) => {
				setPDFProxy({
					...documentProxy,
					getPage: documentProxy.getPage,
					numPages: documentProxy.numPages,
					pageWidth: pageProxy.view[ 2 ],
					pageHeight: pageProxy.view[ 3 ],
					tableStyles: {
						drawing: {
							...defaultTableStyles.drawing,
							...tableStyles.drawing
						},
						not_verified: {
							...defaultTableStyles.not_verified,
							...tableStyles.not_verified
						},
						rejected: {
							...defaultTableStyles.rejected,
							...tableStyles.rejected
						},
						verified: {
							...defaultTableStyles.verified,
							...tableStyles.verified
						},
						completed: {
							...defaultTableStyles.completed,
							...tableStyles.completed
						},

					}
				});
			})
	}

	useEffect(() => {
		PDFProxy && onLoad(PDFProxy as IPDFProxy)
	}, [ PDFProxy, onLoad ])

	const Preloader = () => (
		<ProgressCircle
			transitionDuration={0.1}
			gradient={[ { stop: 0.0, color: '#63cae1' }, { stop: 1, color: '#26a4c0' } ]}
			className='progress_bar_circle'
			progress={progress}
			strokeWidth={8}
			hideBall
		/>
	)

	const pageNumberList = useMemo(() => Array.from({ length: PDFProxy?.numPages || 0 }, (_, i) => i + 1), [ PDFProxy?.numPages ])

	return (
		<PDFContext.Provider value={PDFProxy as IPDFProxy}>
			{progress === 100
				? (
					<Document
						className={`pdf_document ${className} ${PDFProxy ? '' : 'loading'}`}
						file={base64Url}
						onLoadSuccess={handleDocumentLoadSuccess}
						loading={<Preloader />}
						noData={<Preloader />}>
						{PDFProxy
							? typeof children === 'function' ? children(pageNumberList) : children
							: <Preloader />
						}
					</Document>
				) : (
					<div className={`pdf_document loading ${className}`}>
						<Preloader />
					</div>
				)
			}
		</PDFContext.Provider>
	)
}

export default React.memo(PDFDocument);
