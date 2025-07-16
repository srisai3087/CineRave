import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/homePage';
import MoreDetails from './components/moreDetails';
import Login from './pages/login';
import Signup from './pages/signup';
import { useEffect, useState } from 'react';
import cookie from 'js-cookie';
const App = () => {
  const [User, setUser] = useState(() => {
    const isLoggedin = localStorage.getItem('isLoggedIn');
    console.log(isLoggedin);
    if (isLoggedin) {
      return {
        isLoggedin: true,
      };
    } else {
      return {
        isLoggedin: false,
        name: 'User',
      };
    }
  });

  console.log(User);

  const afterLogin = (resObj) => {
    alert('login sucessfull');
    const newUser = { isLoggedin: true, name: resObj.data.name };
    localStorage.setItem('isLoggedIn', true);
    setUser(newUser);
  };

  const getLoggedUserInfo = async () => {
    try {
      console.log('Hello');
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + '/users/me', {
        credentials: 'include',
      });
      const respObj = await resp.json();
      console.log(respObj);
      if (respObj.status === 'success') {
        setUser({
          isLoggedin: true,
          email: respObj.data.email,
          name: respObj.data.name,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + '/user/logout',
        {
          credentials: 'include',
        }
      );
      const respObj = await resp.json();
      console.log(respObj);
      if (respObj.status === 'success') {
        localStorage.removeItem('isLoggedIn');
        alert('logout sucessfully');
        setUser({
          isLoggedin: false,
          name: 'User',
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (User.isLoggedin) {
      getLoggedUserInfo();
    }
  }, [User.isLoggedin]);

  useEffect(() => {
    const verifyToken = () => {
      const token = cookie.get('authorization');
      if (!token) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (isLoggedIn) {
          console.log('checking...');
          setTimeout(verifyToken, 200);
        }

        console.log('tiken not found');
        handleLogout();
      }
    };
  }, []);

  const RedirectToHome = () => {
    return <Navigate to="/" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomePage User={User} handleLogout={handleLogout} />}
          />
          <Route
            path="/moreDetails/:id"
            element={<MoreDetails User={User} handleLogout={handleLogout} />}
          />
          <Route
            path="/login"
            element={
              User.isLoggedin ? (
                <RedirectToHome />
              ) : (
                <Login
                  afterLogin={afterLogin}
                  User={User}
                  handleLogout={handleLogout}
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              User.isLoggedin ? (
                <RedirectToHome />
              ) : (
                <Signup User={User} handleLogout={handleLogout} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
