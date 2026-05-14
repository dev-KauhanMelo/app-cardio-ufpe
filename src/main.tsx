import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/index.css' // ISSO AQUI liga todos os estilos que você postouO caminho para o seu CSS do Tailwind

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)