import { Routes, Route } from 'react-router-dom'
import FilmesPage from '../pages/FilmesPage'
import SalasPage from '../pages/SalasPage'
import SessoesPage from '../pages/SessoesPage'
import CadastrarFilme from '../components/Filmes/CadastrarFilme'
import CadastrarSala from '../components/Salas/CadastrarSala'
import CadastrarSessao from '../components/Sessoes/CadastrarSessao'

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<FilmesPage />} />
      <Route path="/filmes" element={<FilmesPage />} />
      <Route path="/filmes/cadastrar" element={<CadastrarFilme />} />
      <Route path="/salas" element={<SalasPage />} />
      <Route path="/salas/cadastrar" element={<CadastrarSala />} />
      <Route path="/sessoes" element={<SessoesPage />} />
      <Route path="/sessoes/cadastrar" element={<CadastrarSessao />} />
    </Routes>
  )
}

export default RoutesComponent