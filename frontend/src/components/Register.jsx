import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register({ loggedIn, onRegister }) {
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formValue.email || !formValue.password) {
      return;
    }
    onRegister(formValue.email, formValue.password);
  }

  useEffect(() => {
    if (loggedIn) {
      navigate('/', { replace: true });
    }
  }, [loggedIn, navigate]);

  return (
    <main className='auth'>
      <div className='auth__container'>
        <form
          className='popup__form-registration'
          method='post'
          onSubmit={handleSubmit}
        >
          <h2 className='auth__title'>Регистрация</h2>
          <div className='auth__form-container'>
            <input
              className='auth__input'
              id='email-input'
              name='email'
              type='email'
              required=''
              placeholder='Email'
              value={formValue.email}
              onChange={handleChange}
            />
          </div>
          <div className='auth__form-container'>
            <input
              className='auth__input'
              id='password'
              name='password'
              type='password'
              required=''
              placeholder='Пароль'
              value={formValue.password}
              onChange={handleChange}
            />
          </div>
          <div className='auth__form-container'>
            <button className='auth__submit-button' type='submit'>
              Зарегистрироваться
            </button>
            <span className='auth__link'>
              <Link to='/sign-in' className='auth__link'>
                Уже зарегистрированы? Войти
              </Link>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Register;
