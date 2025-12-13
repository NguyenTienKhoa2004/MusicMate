// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setError(null);

        try {
            const response = await fetch("http://localhost:5137/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,       
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Đăng nhập thất bại");
            }
            
            localStorage.setItem("accessToken", data.token);

            console.log("Token đã lưu:", data.token);
            
            navigate("/chat"); 

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Đăng Nhập MusicMate</h2>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    Đăng Nhập
                </button>
            </form>
        </div>
    );
};