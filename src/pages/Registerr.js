import React, { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../axios/axiosInstance';
import { Link } from "react-router-dom";
import './Register.css';

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COMPANY_NAME_REGEX = /^[A-Za-z\s]{2,}$/;
const adresse_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const REGISTER_URL = 'http://localhost:3001/api/v1/users/signup';

const Registerr = () => {

     const [isDarkMode, setIsDarkMode] = useState(() => {
        // Optionnel: Récupérer le thème depuis localStorage s'il existe
        return localStorage.getItem('darkMode') === 'true';
      });
    
      const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        // Optionnel: Sauvegarder le choix dans localStorage
        localStorage.setItem('darkMode', newMode);
      };
    
      // Appliquer le mode sombre au chargement de la page
      useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
      }, []);
    const usernameRef = useRef();
    const companynameRef = useRef();
    const emailRef = useRef();
    const adresseRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [companyname, setcompanyname] = useState('');
    const [validcompanyname, setValidcompanyname] = useState(false);
    const [companynameFocus, setcompanynameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    
    const [adresse, setadresse] = useState('');
    const [validadresse, setValidadresse] = useState(false);
    const [adresseFocus, setadresseFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        usernameRef.current.focus();
    }, [])

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidcompanyname(COMPANY_NAME_REGEX.test(companyname));
    }, [companyname])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidadresse(adresse_REGEX.test(adresse));
    }, [adresse])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidConfirmPassword(password === confirmPassword);
    }, [password, confirmPassword])

    useEffect(() => {
        setErrMsg('');
    }, [username, companyname, email, adresse, password, confirmPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USERNAME_REGEX.test(username);
        const v2 = COMPANY_NAME_REGEX.test(companyname);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = adresse_REGEX.test(adresse);
        const v5 = PASSWORD_REGEX.test(password);
        if (!v1 || !v2 || !v3 || !v4 || !v5) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username, companyname, email, adresse, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setSuccess(true);
            setUsername('');
            setcompanyname('');
            setEmail('');
            setadresse('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }

    }
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword(!showConfirmPassword);
};
    return (
          <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
              <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <div className="register-container">
            {success ? (
                <div className="success-message">
                    <h2>Registration Successful!</h2>
                    <p>Your account has been created successfully.</p>
                    <Link to="/login" className="btn-login">Proceed to Login</Link>
                </div>
            ) : (
                <div className="register-form">
                    <h2 className="form-title">Create Account</h2>
                    <p ref={errRef} className={`error-message ${errMsg ? "visible" : "hidden"}`} aria-live="assertive">
                        {errMsg}
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">
                                Username
                                <span className={validUsername ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validUsername || !username ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={usernameRef}
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                required
                                aria-describedby="uidnote"
                                onFocus={() => setUsernameFocus(true)}
                                onBlur={() => setUsernameFocus(false)}
                                className={usernameFocus && username && !validUsername ? "input-error" : ""}
                            />
                            <div id="uidnote" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="companyname">
                                Company Name
                                <span className={validcompanyname ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validcompanyname || !companyname ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                                type="text"
                                id="companyname"
                                ref={companynameRef}
                                autoComplete="off"
                                onChange={(e) => setcompanyname(e.target.value)}
                                value={companyname}
                                required
                                aria-describedby="companynote"
                                onFocus={() => setcompanynameFocus(true)}
                                onBlur={() => setcompanynameFocus(false)}
                                className={companynameFocus && companyname && !validcompanyname ? "input-error" : ""}
                            />
                            <div id="companynote" className={companynameFocus && companyname && !validcompanyname ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                At least 2 characters.<br />
                                Letters and spaces only.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email
                                <span className={validEmail ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validEmail || !email ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                ref={emailRef}
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                aria-describedby="emailnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                className={emailFocus && email && !validEmail ? "input-error" : ""}
                            />
                            <div id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must be a valid email adresse.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="adresse">
                                adresse
                                <span className={validadresse ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={validadresse || !adresse ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                                type="text"
                                id="adresse"
                                ref={adresseRef}
                                autoComplete="off"
                                onChange={(e) => setadresse(e.target.value)}
                                value={adresse}
                                required
                                aria-describedby="adressenote"
                                onFocus={() => setadresseFocus(true)}
                                onBlur={() => setadresseFocus(false)}
                                className={adresseFocus && adresse && !validadresse ? "input-error" : ""}
                            />
                            <div id="adressenote" className={adresseFocus && adresse && !validadresse ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                           
                                <span className={validPassword || !password ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                           <label htmlFor="password">
    Password
    <span className={validPassword ? "valid" : "hide"}>
      <FontAwesomeIcon icon={faCheck} />
    </span>
    <span className={validPassword || !password ? "hide" : "invalid"}>
      <FontAwesomeIcon icon={faTimes} />
    </span>
  </label>
  <div className="password-input-container">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      onChange={(e) => setPassword(e.target.value)}
      value={password}
      required
      aria-describedby="pwdnote"
      onFocus={() => setPasswordFocus(true)}
      onBlur={() => setPasswordFocus(false)}
      className={passwordFocus && password && !validPassword ? "input-error" : ""}
    />
    <button 
      type="button" 
      className="password-toggle"
      onClick={togglePasswordVisibility}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </button>
  </div>
  <div id="pwdnote" className={passwordFocus && password && !validPassword ? "instructions" : "offscreen"}>
    <FontAwesomeIcon icon={faInfoCircle} />
    8 to 24 characters.<br />
    Must include uppercase and lowercase letters, a number and a special character.<br />
    Allowed special characters: ! @ # $ %
  </div>
</div>

{/* Confirm Password Field */}
<div className="form-group">
  <label htmlFor="confirmPassword">
    Confirm Password
    <span className={validConfirmPassword && confirmPassword ? "valid" : "hide"}>
      <FontAwesomeIcon icon={faCheck} />
    </span>
    <span className={validConfirmPassword || !confirmPassword ? "hide" : "invalid"}>
      <FontAwesomeIcon icon={faTimes} />
    </span>
  </label>
  <div className="password-input-container">
    <input
      type={showConfirmPassword ? "text" : "password"}
      id="confirmPassword"
      onChange={(e) => setConfirmPassword(e.target.value)}
      value={confirmPassword}
      required
      aria-describedby="confirmnote"
      onFocus={() => setConfirmPasswordFocus(true)}
      onBlur={() => setConfirmPasswordFocus(false)}
      className={confirmPasswordFocus && confirmPassword && !validConfirmPassword ? "input-error" : ""}
    />
    <button 
      type="button" 
      className="password-toggle"
      onClick={toggleConfirmPasswordVisibility}
      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
    >
      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
    </button>
  </div>
  <div id="confirmnote" className={confirmPasswordFocus && confirmPassword && !validConfirmPassword ? "instructions" : "offscreen"}>
    <FontAwesomeIcon icon={faInfoCircle} />
    Must match the first password input field.
  </div>
</div>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={!validUsername || !validcompanyname || !validEmail || !validadresse || !validPassword || !validConfirmPassword}
                        >
                            Register
                        </button>
                    </form>

                    <div className="login-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            )}
        </div>     </div>
    )
}



export default Registerr;
