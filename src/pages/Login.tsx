import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async () => {
        try {
            await login(email, password);
            navigate("/");
        } catch {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-80 space-y-4">
                <h1 className="text-xl font-semibold">Login</h1>

                {error && <p className="text-red-600">{error}</p>}

                <input
                    className="w-full border p-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full border p-2"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={submit}
                    className="w-full bg-black text-white p-2"
                >
                    Login
                </button>

                <p className="text-sm text-center">
                    No account?{" "}
                    <Link to="/register" className="underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
