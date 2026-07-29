import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Bootstrap-i i pari, tema jonë pas tij: `index.css` mbishkruan `.form-control`,
// `.modal-content` e të tjera, prandaj duhet të dalë e fundit në paketë.
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// Bootstrap 5.3 i ngjyros modalet, format e dropdown-at sipas `data-bs-theme`,
// dhe e pret atributin te rrënja. Nuk ka ndërrues në ndërfaqe — tema ndjek
// sistemin, prandaj e vëmë këtu dhe e rifreskojmë kur përdoruesi e ndërron.
const temaESistemit = window.matchMedia('(prefers-color-scheme: dark)')

function vendosTemen(eErret) {
  document.documentElement.setAttribute('data-bs-theme', eErret ? 'dark' : 'light')
}

vendosTemen(temaESistemit.matches)
temaESistemit.addEventListener('change', (e) => vendosTemen(e.matches))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
