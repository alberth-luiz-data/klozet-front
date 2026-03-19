import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RotaProtegida from './components/RotaProtegida'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Reservas from './pages/Reservas'
import Estoque from './pages/Estoque'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="estoque" element={<Estoque />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}