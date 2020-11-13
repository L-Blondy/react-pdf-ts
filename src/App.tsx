import './App.scss'
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react';
import PDFDocument from 'src/components/PDFDocument'
import PDFPage from 'src/components/PDFPage'
import { IServerTable } from 'src/components/Table'

axios.defaults.baseURL = "http://127.0.0.1:8000";

function App() {

	// const [ page, setPage ] = useState(1)
	const [ file, setFile ] = useState('Publication.pdf')
	const [ scale, setScale ] = useState(0.8)
	const [ tables, setTables ] = useState<IServerTable[]>([])
	const pendingUpdatesCountRef = useRef(0)

	useEffect(() => {
		axios
			.get('/fileData')
			.then(res => {
				setTables(res.data.current_document.tables)
			})
	}, [])

	function handleDeleteTable(table: IServerTable) {
		setTables(tables.filter(t => t.id !== table.id))
		pendingUpdatesCountRef.current++
		// console.log('DELETE')
		setTimeout(() => {
			pendingUpdatesCountRef.current--
			!pendingUpdatesCountRef.current && setTables(tables.filter(t => t.id !== table.id))
		}, 3000)
	}

	function handleUpdateTable(table: IServerTable) {
		setTables(tables.map(t => t.id === table.id ? table : t))
		pendingUpdatesCountRef.current++
		//fake API response
		setTimeout(() => {
			pendingUpdatesCountRef.current--
			!pendingUpdatesCountRef.current && setTables(tables.map(t => t.id === table.id ? table : t))
		}, 3000)
	}

	function handleCreateTable(table: IServerTable) {
		setTables([ ...tables, table ])
		pendingUpdatesCountRef.current++
		//fake API response
		setTimeout(() => {
			const idFromServer = Math.random() * 100 + 1
			setTables(tables => tables.map(t => t.id !== table.id ? t : { ...t, id: idFromServer }))
		}, 3000)
	}

	function tablesOfPage(p: number) {
		return tables?.filter(t => t.page === p) || []
	}

	return (
		<div className='app'>
			<h2 style={{ position: 'fixed', zIndex: 10000, background: '#eee' }}>
				<button onClick={() => setScale(scale - 0.1)}> - </button>
				Zoom
				<button onClick={() => setScale(scale + 0.1)}> + </button>

				<br />

				<button onClick={() => setFile('SomePDF.pdf')}> SomePDF.pdf </button>
				<button onClick={() => setFile('Publication.pdf')}> Publication.pdf </button>
			</h2>

			{/* 
			<div>
				<button onClick={() => setPage(page - 1)}>Previous page</button>
				<button onClick={() => setPage(page + 1)}>Next page</button>
			</div>

			<br /> */}

			<PDFDocument file={`http://127.0.0.1:8000/pdf/${file}`} tableStyles={{}}>

				{pageNumberList => pageNumberList.map((pageNumber) => (
					<PDFPage
						pageNumber={pageNumber}
						key={'page-' + pageNumber}
						tables={tablesOfPage(pageNumber)}
						onDeleteTable={handleDeleteTable}
						onUpdateTable={handleUpdateTable}
						onCreateTable={handleCreateTable}
						scale={scale}
						hideTags
					// readOnly
					// hidePageNumber
					// onRender={c => console.log(c)}
					// drawTableFill='red'
					// drawTableStroke='green'
					// drawTableStrokeWidth={3}
					// onClickTable={console.log}
					/>
				))}


			</PDFDocument>

		</div>
	)
}

export default React.memo(App);