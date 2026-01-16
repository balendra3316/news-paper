import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Box,
} from "@mui/material";
//import PersonAddOutlined from "@mui/icons-material/PersonAddOutlined";
import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";
import { registerApi } from "../api/auth.api";
import { useSnackbar } from "../context/SnackbarContext";

export default function Register() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      organizationName: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Mapping fullName to name if your API expects 'fullName'
      await registerApi(data);
      showSnackbar("Account created successfully!", "success");
      navigate("/login");
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Added 'hover:scale-[1.01]' for a subtle animation 
          Added 'duration-300' for smoothness 
      */}
      <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 4 }}
          className="shadow-xl border border-gray-100"
        >
          <Box className="flex flex-col items-center mb-8">
            <div className="bg-black text-white p-3 rounded-full mb-3 shadow-lg">
              <UserPlus size={32} strokeWidth={2} />
            </div>
            <Typography
              variant="h4"
              fontWeight="bold"
              className="text-gray-800"
            >
              Register
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Create your organization account
            </Typography>
          </Box>

          {/* 'space-y-5' creates the gap between your inputs */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[20px] space-y-5"
          >
            <TextField
              {...register("fullName")}
              label="Full Name"
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              variant="outlined"
            />

            <TextField
              {...register("email")}
              label="Email Address"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
            />

            <TextField
              {...register("organizationName")}
              label="Organization Name"
              fullWidth
              error={!!errors.organizationName}
              helperText={errors.organizationName?.message}
              variant="outlined"
            />

            <TextField
              {...register("password")}
              label="Password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              // Matching the Login button color and adding hover effects
              className="h-12 bg-black hover:bg-gray-800 transition-colors text-white font-bold rounded-lg"
              sx={{
                mt: 2,
                textTransform: "none",
                fontSize: "1rem",
                backgroundColor: "#000",
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-bold underline hover:text-gray-800 transition-colors"
              >
                Login
              </Link>
            </Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
}
