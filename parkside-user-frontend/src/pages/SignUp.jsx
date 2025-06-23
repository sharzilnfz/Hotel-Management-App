import axios from 'axios'; // NEW: Import axios for API calls
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../contexts/ContentContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    subscribe: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // State for success/error feedback

  // Get content from ContentContext
  const contentContext = useContext(ContentContext);
  const { homeContent } = contentContext;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setFeedback({ message: '', type: '' }); // NEW: Clear previous feedback

    try {
      //  Map form data to backend expected fields
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        userName: formData.email, // Using email as username
        email: formData.email,
        password: formData.password,
        role: 'user', // Default role
        phone: formData.phone,
        isStaff: false, // Default to non-staff user
        department: null, // Optional field
      };

      //  Make API call to backend

      const response = await axios.post(
        'http://localhost:4000/api/users/signup',
        payload
      );

      //  Handle success
      if (response.data.success) {
        setFeedback({
          message: 'Sign up successful! Redirecting to login...',
          type: 'success',
        });
        console.log('Sign up response:', response.data);

        //  Redirect to login after 0.5 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      } else {
        setFeedback({
          message: response.data.message || 'Sign up failed. Please try again.',
          type: 'error',
        });
      }
      console.log('Sign up response:', response.data);
    } catch (error) {
      // Handle error response
      const errorMessage =
        error.response?.data?.error || 'Sign up failed. Please try again.';
      setFeedback({ message: errorMessage, type: 'error' });
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Content */}
      <div className="content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs-wrap">
          <div className="container">
            <Link to="/">Home</Link>
            <Link to="/signup">Account</Link>
            <span>Sign Up</span>
          </div>
        </div>
        {/* Breadcrumbs end */}

        {/* Main section */}
        <div className="content-section">
          <div className="section-dec"></div>
          <div className="container small-container">
            <div className="auth-container">
              <div className="auth-card">
                <div className="auth-card-header">
                  <h3>Create Account</h3>
                  <p>
                    Join us today and enjoy exclusive benefits and personalized
                    service
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="name-row">
                    <div className="input-group">
                      <label htmlFor="firstName">First Name</label>
                      <div className="input-wrapper">
                        <i className="fa-light fa-user"></i>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First name"
                          className={errors.firstName ? 'error' : ''}
                        />
                      </div>
                      {errors.firstName && (
                        <span className="error-message">
                          {errors.firstName}
                        </span>
                      )}
                    </div>

                    <div className="input-group">
                      <label htmlFor="lastName">Last Name</label>
                      <div className="input-wrapper">
                        <i className="fa-light fa-user"></i>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                          className={errors.lastName ? 'error' : ''}
                        />
                      </div>
                      {errors.lastName && (
                        <span className="error-message">{errors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <i className="fa-light fa-envelope"></i>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-wrapper">
                      <i className="fa-light fa-phone"></i>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <i className="fa-light fa-lock"></i>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className={errors.password ? 'error' : ''}
                      />
                    </div>
                    {errors.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                      <i className="fa-light fa-lock"></i>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={errors.confirmPassword ? 'error' : ''}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <span className="error-message">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>I agree to the{' '}
                      <Link to="/terms">Terms of Service</Link> and{' '}
                      <Link to="/privacy">Privacy Policy</Link>
                    </label>
                    {errors.agreeToTerms && (
                      <span className="error-message">
                        {errors.agreeToTerms}
                      </span>
                    )}
                  </div>

                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="subscribe"
                        checked={formData.subscribe}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      Subscribe to our newsletter for exclusive offers and
                      updates
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`auth-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-light fa-spinner fa-spin"></i>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fa-light fa-user-plus"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <div className="social-auth">
                  <button className="social-btn google-btn">
                    <i className="fa-brands fa-google"></i>
                    Sign up with Google
                  </button>
                  <button className="social-btn facebook-btn">
                    <i className="fa-brands fa-facebook-f"></i>
                    Sign up with Facebook
                  </button>
                </div>

                <div className="auth-footer">
                  <p>
                    Already have an account?{' '}
                    <Link to="/login">Sign in here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main section end */}
        <div className="content-dec">
          <span></span>
        </div>
      </div>
      {/* Content end */}

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 60px 0;
        }

        .auth-card {
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 50px;
          width: 100%;
          max-width: 600px;
          border: 1px solid #eee;
          position: relative;
        }

        .auth-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(45deg, #c4a676, #d4b686);
          border-radius: 15px 15px 0 0;
        }

        .auth-card-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .auth-card-header h3 {
          color: #272535;
          font-size: 2.5em;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .auth-card-header p {
          color: #666;
          font-size: 1.1em;
          margin: 0;
          text-align: center;
        }

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .input-group {
          margin-bottom: 25px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
          font-family: var(--secondary-font);
          text-transform: uppercase;
          font-size: 0.9em;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #c4a676;
          font-size: 1.1em;
        }

        .input-wrapper input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          border: 2px solid #eee;
          border-radius: 8px;
          font-size: 1em;
          font-family: var(--secondary-font);
          transition: all 0.3s ease;
          background: #fafafa;

          color: #333 !important;
        }

        .input-wrapper input::placeholder {
          color: #999 !important;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #c4a676;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(196, 166, 118, 0.1);
        }

        .input-wrapper input.error {
          border-color: #e74c3c;
          background: #fdf2f2;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.85em;
          margin-top: 5px;
          display: block;
          font-family: var(--secondary-font);
        }

        .checkbox-group {
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          font-family: var(--secondary-font);
          color: #666;
          line-height: 1.5;
        }

        .checkbox-label input[type='checkbox'] {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid #ddd;
          border-radius: 3px;
          margin-right: 12px;
          margin-top: 2px;
          position: relative;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .checkbox-label input[type='checkbox']:checked + .checkmark {
          background: #c4a676;
          border-color: #c4a676;
        }

        .checkbox-label input[type='checkbox']:checked + .checkmark:after {
          content: '\f00c';
          font-family: 'Font Awesome 6 Pro';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 10px;
        }

        .checkbox-label a {
          color: #c4a676;
          text-decoration: none;
          font-weight: 600;
        }

        .checkbox-label a:hover {
          color: #272535;
        }

        .auth-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(45deg, #c4a676, #d4b686);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: var(--secondary-font);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 20px 0 30px;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(196, 166, 118, 0.3);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn i {
          margin-right: 8px;
        }

        .auth-divider {
          text-align: center;
          margin: 30px 0;
          position: relative;
        }

        .auth-divider:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #eee;
        }

        .auth-divider span {
          background: #fff;
          padding: 0 20px;
          color: #999;
          font-family: var(--secondary-font);
          position: relative;
          z-index: 1;
        }

        .social-auth {
          margin-bottom: 30px;
        }

        .social-btn {
          width: 100%;
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 8px;
          background: #fff;
          color: #666;
          font-family: var(--secondary-font);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-btn:hover {
          border-color: #c4a676;
          color: #c4a676;
        }

        .social-btn i {
          margin-right: 10px;
          font-size: 1.1em;
        }

        .google-btn:hover {
          border-color: #db4437;
          color: #db4437;
        }

        .facebook-btn:hover {
          border-color: #3b5998;
          color: #3b5998;
        }

        .auth-footer {
          text-align: center;
          border-top: 1px solid #eee;
          padding-top: 25px;
        }

        .auth-footer p {
          margin: 0;
          color: #666;
          font-family: var(--secondary-font);
          text-align: center;
        }

        .auth-footer a {
          color: #c4a676;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          color: #272535;
        }

        @media (max-width: 768px) {
          .auth-card {
            padding: 30px 25px;
            margin: 20px;
            max-width: 500px;
          }

          .name-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .auth-container {
            min-height: 70vh;
            padding: 40px 0;
          }
          .feedback {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 4px;
            text-align: center;
          }
          .feedback.success {
            background-color: #d4edda;
            color: #155724;
          }
          .feedback.error {
            background-color: #f8d7da;
            color: #721c24;
          }
        }
      `}</style>
    </>
  );
};

export default SignUp;
