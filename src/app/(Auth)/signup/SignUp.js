import React, { useState } from "react";
import {
  Form,
  Button,
  Panel,
  InputGroup,
  Checkbox,
  Divider,
} from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false); // For password visibility
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [fieldErrors, setFieldErrors] = useState({}); // Errors for individual fields

  const handleInputChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" }); // Clear specific field error
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
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.agreed) {
      errors.agreed = "You must agree to the terms and conditions.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Simulate API call or Firebase integration
    console.log("Sign-up data submitted:", formData);

    // Redirect to the sign-in page after successful registration
    navigate("/sign-in");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-8 animate__animated animate__fadeIn"
    >
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
              onChange={(value) =>
                handleInputChange(value, "confirmPassword")
              }
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

          {/* Terms and Conditions */}
          <Form.Group>
            <Checkbox
              checked={formData.agreed}
              onChange={(value, checked) =>
                setFormData((prev) => ({ ...prev, agreed: checked }))
              }
              style={{
                marginBottom: "20px",
                color: "#374151",
                fontSize: "16px",
              }}
            >
              I agree to the{" "}
              <a
                href="#terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                }}
              >
                Terms and Conditions
              </a>
            </Checkbox>
            {fieldErrors.agreed && (
              <div className="text-red-500 text-sm mt-1">
                {fieldErrors.agreed}
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