import './PDFDocument.scss'
import React, { useState, useEffect, useContext, createContext, useMemo, useCallback } from 'react';
import { Document } from 'react-pdf';
import { PDFPageProxy } from 'react-pdf/dist/Page'
import { IAllTableStyles, ITableStyles, IServerTable, ILibraryTable } from 'src/components/Table'
import useLoadDocument from './useLoadDocument'
import useTableStyles from './useTableStyles'
import { useKeyBinding, useUpdatedRef } from 'src/hooks'
import { toLibraryTables } from './helpers'

export interface IDocumentProxy {
	getPage: (page: number) => Promise<PDFPageProxy>
	numPages: number;
	pageWidth: number;
	pageHeight: number;
}

export interface PagePropsFromDocument {
	pageNumber: number,
	documentProxy: IDocumentProxy;
	getTableStyles: (table: ILibraryTable) => ITableStyles
}

interface Props {
	file: string
	tables: IServerTable[]
	className?: string
	tableStyles?: IAllTableStyles
	children: (pageList: number[], propsForPageNumber: (pageNumber: number) => PagePropsFromDocument) => React.ReactChildren | React.ReactNode
	onLoad?: (documentProxy: IDocumentProxy) => void
}

const PDFDocument = ({
	file: src,
	tables: serverTables = [],
	tableStyles: customTableStyles = {},
	children,
	onLoad = () => { },
	...props
}: Props) => {

	const onLoadRef = useUpdatedRef(onLoad)

	const { state, bindToDocument, pageList, preloader } = useLoadDocument(src)
	const getTableStyles = useTableStyles(customTableStyles)

	useEffect(() => {
		state.data && onLoadRef.current(state.data)
	}, [ state.data ]) //eslint-disable-line


	const propsForPageNumber = useCallback((pageNumber) => ({
		key: `${src}_page-number-${pageNumber}`,
		pageNumber,
		documentProxy: state.data as IDocumentProxy,
		getTableStyles,
		// timeStamp,
		// keyBinding,
	}), [ src, state.data, getTableStyles ])

	return (
		<Document {...bindToDocument} {...props} >
			{!state.data && preloader}
			{ state.data && children(pageList, propsForPageNumber)}
		</Document>
	)

	// const handleDocumentLoadSuccess = (documentProxy: any) => {
	// 	documentProxy
	// 		.getPage(1)
	// 		.then((pageProxy: PDFPageProxy) => {
	// 			dispatch([ 'data', {
	// 				...documentProxy,
	// 				getPage: documentProxy.getPage,
	// 				numPages: documentProxy.numPages,
	// 				pageWidth: pageProxy.view[ 2 ],
	// 				pageHeight: pageProxy.view[ 3 ],
	// 				tableStyles: {
	// 					drawing: {
	// 						...defaultTableStyles.drawing,
	// 						...tableStyles.drawing
	// 					},
	// 					not_verified: {
	// 						...defaultTableStyles.not_verified,
	// 						...tableStyles.not_verified
	// 					},
	// 					rejected: {
	// 						...defaultTableStyles.rejected,
	// 						...tableStyles.rejected
	// 					},
	// 					verified: {
	// 						...defaultTableStyles.verified,
	// 						...tableStyles.verified
	// 					},
	// 					completed: {
	// 						...defaultTableStyles.completed,
	// 						...tableStyles.completed
	// 					},

	// 				}
	// 			} as IPDFProxy ]);
	// 		})
	// }

	// useEffect(() => {
	// 	state.data && onLoad(state.data)
	// }, [ state.data, onLoad ])

	// const Preloader = () => (
	// 	<ProgressCircle
	// 		transitionDuration={0.1}
	// 		gradient={[ { stop: 0.0, color: '#63cae1' }, { stop: 1, color: '#26a4c0' } ]}
	// 		className='progress_bar_circle'
	// 		progress={state.progress}
	// 		strokeWidth={8}
	// 		hideBall
	// 	/>
	// )

	// const pageNumberList = useMemo(() => (
	// 	Array.from({ length: state.data?.numPages || 0 }, (_, i) => i + 1)
	// ), [ state.data?.numPages ])

	// return (
	// 	<>
	// 		{state.error && (
	// 			JSON.stringify(state.error)
	// 		)}
	// 		{!state.error && state.progress < 100 && (
	// 			<div className={`pdf_document loading ${className}`}>
	// 				<Preloader />
	// 			</div>
	// 		)}
	// 		{!state.error && state.progress === 100 && (
	// 			<Document
	// 				className={`pdf_document ${className} ${state.data ? '' : 'loading'}`}
	// 				file={base64Url}
	// 				onLoadSuccess={handleDocumentLoadSuccess}
	// 				loading={<Preloader />}
	// 				noData={<Preloader />}>
	// 				{state.data
	// 					? typeof children === 'function' ? children(pageNumberList) : children
	// 					: <Preloader />
	// 				}
	// 			</Document>
	// 		)}
	// 	</>
	// )
}

export default React.memo(PDFDocument);
