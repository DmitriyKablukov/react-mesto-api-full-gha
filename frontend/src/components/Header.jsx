import '../index.css';
import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';

function Header({ email, headerLink, onExitProfile, path, onClick }) {
  return (
    <div>
      <header className='header'>
        <img className='header__logo' src={logo} alt='Логотип Место' />
        <div className='header__container'>
          <p className='header__email'>{email}</p>
          <Link
            className='header__link header__link_sign-out'
            to={path}
            onClick={onClick}
          >
            {onExitProfile}
          </Link>
          <p className='header__link'>
            <Link className='header__link' to={path}>
              {headerLink}
            </Link>
          </p>
        </div>
      </header>
    </div>
  );
}

export default Header;
