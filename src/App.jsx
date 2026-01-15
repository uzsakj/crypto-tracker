import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { CoinDetail } from './pages/CoinDetail'
import { Home } from './pages/Home'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/coin/:id' element={<CoinDetail />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
