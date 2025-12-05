import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import RoutesComponent from './routes/Routes'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <RoutesComponent />
        </div>
      </div>
    </Router>
  )
}

export default App