import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { getCookies, setCookies, removeCookies } from './utils/Coockies';
import { getUserLogged } from './repositories/AuthRepository';
import { useUser } from './context/UserContext';

import Navigation from './components/Navigation';
import VerifyPage from './pages/VerifyPage';

function App() {
  const { user, setUser } = useUser();

  useEffect(() => {
    const getUser = async () => {
      const data = getCookies();
      await getUserLoginData({accessToken: data.token});
    };

    getUser();
  }, []);

  const getUserLoginData = async ({ accessToken }) => {
    const { data } = await getUserLogged(accessToken);
    setCookies(data);

    setUser(data);
  };

  const onLogOut = () => {
    removeCookies();
    setUser(null);
  };


  if (!user) {
    return (
      <div>
        <main className='w-100'>
          <Routes>
            <Route path="/*" element={<LoginPage loginSuccess={getUserLoginData} />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navigation user={user} onLogOut={onLogOut} />
      <main className='w-100'>
        <Routes>
          <Route path="/" element={<ProfilePage user={user} onRefresh={getUserLoginData}/>} />
          <Route path="/verify/*" element={<VerifyPage onVerify={getUserLoginData}/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;