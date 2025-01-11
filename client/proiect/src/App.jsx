import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Conference from './pages/Conferene';
import Article from './pages/Article';
import useCheckToken from './hooks/useCheckToken';
import WriteArticle from './pages/WriteArticle';

function App() {
  useCheckToken();

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/login' element={(<Login/>)}/>
          <Route path="/conferences/:id" element={<Conference />} />
          <Route path="/articles/:id" element={<Article />} />
          <Route path="/conferences/:id/write" element={<WriteArticle />} />
          <Route path="/articles/:id/edit" element={<WriteArticle />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
