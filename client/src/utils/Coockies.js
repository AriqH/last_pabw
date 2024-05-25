import Cookies from 'js-cookie';

const setCookies = (id, fullname, profile_picture, umur, role, iat, exp) => {
  Cookies.set('user', JSON.stringify({ id, fullname, profile_picture, umur, role, iat, exp }));

  return true;
};

const getCookies = () => {
  const user = Cookies.get('user');
  
  return user ? JSON.parse(user).id : null;
}

const removeCookies = () => {
  Cookies.remove('user');
}

export { setCookies, getCookies, removeCookies };