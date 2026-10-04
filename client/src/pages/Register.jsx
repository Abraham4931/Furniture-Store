import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

import { register } from "../services/authApi";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Return the customer to the page they originally wanted.
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

    // Basic validation
    if (!formData.first_name.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!formData.last_name.trim()) {
      setError("Please enter your last name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      /*
       * If the backend automatically logs the user in,
       * it should return something like:
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
       */

      const data = response.data;

      if (data.token) {
        const user = data.user || data;

        localStorage.setItem(
          "fernwood_user",
          JSON.stringify({
            token: data.token,
            user,
          })
        );

        window.dispatchEvent(new Event("fernwood:auth-updated"));

        navigate(redirectPath, { replace: true });
        return;
      }

      /*
       * If registration succeeds but the backend does not
       * return a JWT, send the customer to login.
       */
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-block text-3xl font-bold tracking-tight text-[#031008]"
            >
              Fernwood
            </Link>

            <p className="mt-2 text-sm text-gray-600">
              Create your account and start shopping.
            </p>
          </div>

          {/* Register Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#031008]">
                Create an account
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Fill in your details to create your Fernwood account.
              </p>
            </div>

            {error && (
              <div className="mb-5">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="First name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  placeholder="First name"
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                  disabled={loading}
                />

                <Input
                  label="Last name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  placeholder="Last name"
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                  disabled={loading}
                />
              </div>

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

              {/* Phone */}
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                placeholder="+251 9XX XXX XXX"
                onChange={handleChange}
                autoComplete="tel"
                required
                disabled={loading}
              />

              {/* Password */}
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                placeholder="Create a password"
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />

              {/* Confirm Password */}
              <Input
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleChange}
                autoComplete="new-password"
                required
                disabled={loading}
              />

              {/* Register */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
              >
                Create account
              </Button>
            </form>

            {/* Login */}
            <div className="mt-6 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#33473B] hover:underline"
                >
                  Sign in
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

export default Register;