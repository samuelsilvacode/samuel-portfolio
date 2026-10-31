import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import CrmApp from './crm/CrmApp'
import RhApp from './rh/RhApp'
import ProjetoPagina from './site/ProjetoPagina'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/crm/*" element={<CrmApp />} />
      <Route path="/rh/*" element={<RhApp />} />
      <Route path="/projeto/:slug" element={<ProjetoPagina />} />
    </Routes>
  )
}
