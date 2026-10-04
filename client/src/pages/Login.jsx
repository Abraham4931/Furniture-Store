import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

import { login } from "../services/authApi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If the user was redirected to login from another page,
  // remember where they wanted to go.
  const redirectPath = location.state?.from || "/";

  useEffect(() => {
    const storedUser = localStorage.getItem("fernwood_user");

    if (storedUser) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      /*
       * Expected successful response:
       *
       * {
       *   token: "...",
       *   user: {
       *     id: 1,
       *     first_name: "...",
       *     last_name: "...",
       *     email: "..."
       *   }
       * }
       *
       * Some backends may return the user directly alongside the token.
       */

      const data = response.data;

      const token = data.token;

      const user = data.user || data;

      if (!token) {
        throw new Error("Authentication token was not returned by the server.");
      }

      const storedUser = {
        token,
        user,
      };

      localStorage.setItem(
        "fernwood_user",
        JSON.stringify(storedUser)
      );

      // Notify other parts of the application that authentication changed.
      window.dispatchEvent(new Event("fernwood:auth-updated"));

      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your email and password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-block text-3xl font-bold tracking-tight text-[#031008]"
            >
              Fernwood
            </Link>

            <p className="mt-2 text-sm text-gray-600">
              Welcome back. Sign in to your account.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#031008]">
                Sign in
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Enter your account details to continue.
              </p>
            </div>

            {error && (
              <div className="mb-5">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={loading}
              />

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={loading}
              />

              {/* Remember + Forgot password */}
              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-[#031008] focus:ring-[#33473B]"
                  />

                  <span className="text-sm text-gray-600">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-[#33473B] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
              >
                Sign in
              </Button>
            </form>

            {/* Register */}
            <div className="mt-6 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#33473B] hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Back to store */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-[#031008]"
            >
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;