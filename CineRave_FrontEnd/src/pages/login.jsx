import NavBar from '../components/navBar';
import './login.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Footer from '../components/footer';
const Login = ({ afterLogin, User, handleLogout }) => {
  const [login, setlogin] = useState({});
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setlogin((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/users/login',
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(login),
          headers: {
            'content-type': 'application/json',
          },
        }
      );
      const respObj = await resp.json();
      if (respObj.status === 'fail') {
        alert(respObj.message);
        return;
      }

      // alert('login sucessfully');
      afterLogin(respObj);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />
      <div className="main-content">
        <div className="login-form">
          <form onSubmit={handleLogin} className="form-details-login">
            <h1 className="login-heading">Login</h1>
            <label>Email</label>
            <input
              className="input-details"
              type="email"
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email"
              required
            />
            <label>Password</label>
            <input
              className="input-details"
              type="password"
              placeholder="Password"
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            <button className="login-button-main">Log in</button>

            <p className="information">
              Don't have an account?
              <Link to="/signup" className="signup">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
