import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, maxWidth: '960px', margin: '2rem auto', width: '100%', padding: '0 1rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
