import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { login } from "../repositories/AuthRepository";
import LoginInput from "../components/LoginInput";

function LoginPage({ loginSuccess }) {
  const onLogin = async ({ email, password }) => {
    const { error, data } = await login({ email, password });
    if (!error) {
      loginSuccess({ accessToken: data });
    } else {
      alert(data);
    }
  };

  return (
    <section className="bg-cyan-50 dark:bg-cyan-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          PABW PRAKTIKUM LOGIN
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Masuk menggunakan email anda
            </h1>
            <LoginInput login={onLogin} />
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

LoginPage.propTypes = {
  loginSuccess: PropTypes.func.isRequired,
};

export default LoginPage;
