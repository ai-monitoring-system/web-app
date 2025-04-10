import React, { useState } from "react";
import {
  Form,
  Button,
  Panel,
  InputGroup,
  Divider,
} from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";
import { useAuth } from "../../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, validatePassword, passwordMessage } = useAuth();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = "Username is required.";
    }
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      errors.password = passwordMessage;
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.username
      );
      navigate("/sign-in");
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.code === "auth/email-already-in-use") {
        setFieldErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          general: err.message || "Failed to sign up. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-8 animate__animated animate__fadeIn">
      <Panel
        bordered
        className="animate__animated animate__zoomIn animate__faster"
        style={{
          maxWidth: "700px",
          width: "100%",
          padding: "50px 40px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1f2937",
            fontWeight: "700",
            marginBottom: "24px",
            fontSize: "32px",
          }}
        >
          Create Your Account
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          Join us and explore our amazing platform. It only takes a few steps!
        </p>

        {fieldErrors.general && (
          <div className="text-red-500 text-sm text-center mb-4">
            {fieldErrors.general}
          </div>
        )}

        <Form fluid>
          {/* Username */}
          <Form.Group>
            <Form.ControlLabel
              style={{ fontWeight: "600", color: "#374151", fontSize: "16px" }}
            >
              Username
            </Form.ControlLabel>
            <Form.Control
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(value) => handleInputChange(value, "username")}
              style={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
              }}
            />
            {fieldErrors.username && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.username}
              </div>
            )}
          </Form.Group>

          {/* Email */}
          <Form.Group>
            <Form.ControlLabel
              style={{ fontWeight: "600", color: "#374151", fontSize: "16px" }}
            >
              Email
            </Form.ControlLabel>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleInputChange(value, "email")}
              style={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
              }}
            />
            {fieldErrors.email && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.email}
              </div>
            )}
          </Form.Group>

          {/* Password */}
          <Form.Group>
            <Form.ControlLabel
              style={{ fontWeight: "600", color: "#374151", fontSize: "16px" }}
            >
              Password
            </Form.ControlLabel>
            <InputGroup inside style={{ width: "100%", height: "48px" }}>
              <Form.Control
                name="password"
                type={visible ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(value) => handleInputChange(value, "password")}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "16px",
                  height: "100%",
                }}
                autoComplete="off"
              />
              <InputGroup.Button
                onClick={() => setVisible(!visible)}
                style={{
                  background: "transparent",
                  padding: "0 12px",
                  borderRadius: "0 8px 8px 0",
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {visible ? <EyeIcon size={20} /> : <EyeSlashIcon size={20} />}
              </InputGroup.Button>
            </InputGroup>
            {fieldErrors.password && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </div>
            )}
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group>
            <Form.ControlLabel
              style={{ fontWeight: "600", color: "#374151", fontSize: "16px" }}
            >
              Confirm Password
            </Form.ControlLabel>
            <Form.Control
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange(value, "confirmPassword")}
              style={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
              }}
            />
            {fieldErrors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.confirmPassword}
              </div>
            )}
          </Form.Group>

          {/* Submit Button */}
          <Form.Group>
            <Button
              appearance="primary"
              block
              onClick={handleSubmit}
              style={{
                background: "#3b82f6",
                border: "none",
                padding: "16px 0",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "8px",
                color: "#fff",
              }}
            >
              Sign Up
            </Button>
          </Form.Group>

          <Divider>or</Divider>

          <p
            style={{
              textAlign: "center",
              color: "#374151",
              marginBottom: "0",
              fontSize: "16px",
            }}
          >
            Already have an account?{" "}
            <Link to="/sign-in" style={{ color: "#2563eb", fontWeight: "bold" }}>
              Sign In
            </Link>
          </p>
        </Form>
      </Panel>
    </div>
  );
};

export default SignUp;
