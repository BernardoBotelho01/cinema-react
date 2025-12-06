import { Routes, Route } from 'react-router-dom'
import FilmesPage from '../pages/FilmesPage'
import SalasPage from '../pages/SalasPage'
import SessoesPage from '../pages/SessoesPage'
import CadastrarFilme from '../components/Filmes/CadastrarFilme'
import CadastrarSala from '../components/Salas/CadastrarSala'
import CadastrarSessao from '../components/Sessoes/CadastrarSessao'
import LanchesPage from '../pages/LanchesPage'
import CadastrarLanche from '../components/Lanches/CadastrarLanche'

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

      {/* NOVO */}
      <Route path="/lanches" element={<LanchesPage />} />
      <Route path="/lanches/cadastrar" element={<CadastrarLanche />} />
    </Routes>
  )
}

export default RoutesComponent
