import { useNavigate } from 'react-router';
import Footer from '../components/footer';
import './login.css';
import NavBar from '../components/navBar';
import { useState } from 'react';
import { Link } from 'react-router';
const Signup = ({ User, handleLogout }) => {
  const [otpdetails, setOtpDetails] = useState({});
  const [isotpSent, setisotpSent] = useState(false);
  const [details, setdetails] = useState({});
  const navigate = useNavigate();

  const handleChangeOtpDetails = (key, values) => {
    setOtpDetails((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // console.log('otp: ', otpdetails);

  const handleChange = (key, value) => {
    setdetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // console.log('details: ', details);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.password.value);
    console.log(e.target.conformPassword.value);

    if (e.target.password.value !== e.target.conformPassword.value) {
      alert('passwords do not match');
      return;
    }

    try {
      console.log('hello');
      e.preventDefault();
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/users/register',
        {
          method: 'POST',
          body: JSON.stringify({ ...otpdetails, ...details }),
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
      alert('sucessfully registered');
      navigate('/login');
      setdetails({ email: '', otp: '', password: '' });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    console.log('in submit function');
    console.log(otpdetails);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/otps', {
        method: 'POST',
        body: JSON.stringify(otpdetails),
        headers: {
          'content-type': 'application/json',
        },
      });

      const respObj = await resp.json();
      console.log(respObj);
      if (respObj.status === 'failure') {
        alert(respObj.message);
        return;
      }
      setisotpSent(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <NavBar User={User} handleLogout={handleLogout} />

      {isotpSent ? (
        <div className="main-content">
          <div className="login-form">
            <form onSubmit={handleSubmit} className="form-details-login">
              <h1 className="login-heading">Signup</h1>
              <label>Email</label>
              <input
                className="input-details"
                type="email"
                name="email"
                value={otpdetails.email}
                // onChange={(e) => handleChange('email', e.target.value)}
                readOnly
              />

              <label>Enter otp</label>
              <input
                className="input-details"
                type="number"
                name="otp"
                placeholder="Enter otp"
                onChange={(e) => handleChange('otp', e.target.value)}
                required
              />

              <label>Password</label>
              <input
                className="input-details"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />

              <label>conform Password</label>
              <input
                className="input-details"
                type="password"
                name="conformPassword"
                placeholder="Enter password"
                onChange={(e) =>
                  handleChange('conformPassword', e.target.value)
                }
                required
              />

              <button className="login-button-main">Conform</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="login-form">
            <form onSubmit={handleSubmitOtp} className="form-details-login">
              <h1 className="login-heading">Signup</h1>

              <label>Full Name</label>
              <input
                className="input-details"
                type="text"
                name="name"
                placeholder="Name"
                onChange={(e) => handleChangeOtpDetails('name', e.target.value)}
                required
              />

              <label>Email</label>
              <input
                className="input-details"
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) =>
                  handleChangeOtpDetails('email', e.target.value)
                }
                required
              />
              <button type="submit" className="login-button-main">
                Send otp
              </button>

              <p className="information">
                Already have an account?
                <Link to="/login" className="signup">
                  sigin
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Signup;
