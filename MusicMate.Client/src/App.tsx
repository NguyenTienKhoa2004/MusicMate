import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { HomePage } from './components/HomePage';
import { ChatRoom } from './components/ChatRoom'
import Login from './components/Login';
import { GenreSelection } from './components/GenreSelection';

import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                
                <Route path="/" element={<Navigate to="/home" replace />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/genres"
                    element={
                        <ProtectedRoute>
                            <GenreSelection />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatRoom />
                        </ProtectedRoute>
                    }
                />
                
                <Route path="*" element={<div style={{color:'white', textAlign:'center', marginTop:'50px'}}>404 - Không tìm thấy trang</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;