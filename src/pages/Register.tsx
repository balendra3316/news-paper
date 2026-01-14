import { useState } from "react";
import { registerApi } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organizationName, setorg] = useState("");

    const submit = async () => {
        await registerApi({ fullName: name, email, password, organizationName });
        navigate("/login");
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-80 space-y-4">
                <h1 className="text-xl font-semibold">Register</h1>

                <input
                    className="w-full border p-2"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full border p-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full border p-2"
                    placeholder="Organization"
                    value={organizationName}
                    onChange={(e) => setorg(e.target.value)}
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
                    Create Account
                </button>

                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
