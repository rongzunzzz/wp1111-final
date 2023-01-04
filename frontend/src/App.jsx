// routes
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/Homepage';
import CoursesPage from './pages/CoursesPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Setting from './pages/Setting';

// styles
import './App.css'

const App = () => {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/courses' element={<CoursesPage />} />
                    <Route path='/setting' element={<Setting />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App;
