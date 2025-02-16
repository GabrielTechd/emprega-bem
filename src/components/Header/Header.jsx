import "./Header.css";
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, userProfile, userType, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  const displayName = user?.name || userProfile?.nome || user?.email || 'Usuário';
  const firstName = displayName.split(' ')[0];
  const userInitial = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
      setShowUserMenu(false);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          EmpregaBem
        </Link>

        <nav className="nav-menu">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
          </ul>

          {user ? (
            <div className="user-menu" ref={menuRef}>
              <div 
                className="user-info"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {userInitial}
                </div>
                <span>{displayName}</span>
              </div>

              {showUserMenu && (
                <div className="user-dropdown">
                  <button onClick={handleProfileClick} className="dropdown-item">
                    Meu Perfil
                  </button>
                  <button onClick={handleSignOut} className="dropdown-item">
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Entrar
              </Link>
              <Link to="/register" className="register-button">
                Cadastrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
