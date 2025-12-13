import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ChatRoom } from './components/ChatRoom'
import { Login } from './components/Login';


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatRoom />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;