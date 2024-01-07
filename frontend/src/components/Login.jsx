import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ loggedIn, onLogin }) {
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
    onLogin(formValue.email, formValue.password);
    if (loggedIn) {
      setFormValue({ email: '', password: '' });
    }
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
          <h2 className='auth__title'>Вход</h2>
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
              Войти
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
