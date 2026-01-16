// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Link, useNavigate } from "react-router-dom";

// export default function Login() {
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     const submit = async () => {
//         try {
//             await login(email, password);
//             navigate("/");
//         } catch {
//             setError("Invalid credentials");
//         }
//     };

//     return (
//         <div className="h-screen flex items-center justify-center">
//             <div className="w-80 space-y-4">
//                 <h1 className="text-xl font-semibold">Login</h1>

//                 {error && <p className="text-red-600">{error}</p>}

//                 <input
//                     className="w-full border p-2"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />

//                 <input
//                     className="w-full border p-2"
//                     placeholder="Password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />

//                 <button
//                     onClick={submit}
//                     className="w-full bg-black text-white p-2"
//                 >
//                     Login
//                 </button>

//                 <p className="text-sm text-center">
//                     No account?{" "}
//                     <Link to="/register" className="underline">
//                         Register
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      showSnackbar("Login successful!", "success");
      navigate("/");
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Login
          </Typography>

          <TextField
            label="Email Address"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              height: 48,
              backgroundColor: "#1a1a1a",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Typography align="center" variant="body2" sx={{ mt: 1 }}>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
