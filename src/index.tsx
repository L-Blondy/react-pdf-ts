import 'src/styles/global.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import "konva";
import App from './App';
import { pdfjs } from 'react-pdf';
import KeyDownListCtx from 'src/context/KeyDownListCtx'

ReactDOM.render(
  <React.StrictMode>
    <KeyDownListCtx>
      <App />
    </KeyDownListCtx>
  </React.StrictMode>,
  document.getElementById('root')
)

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;