import 'src/styles/global.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import "konva";
import App from './App';
import { pdfjs } from 'react-pdf';

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById('root')
)

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;