
import './header.css';
import { useEffect, useState } from 'react';

//assets
import ExdevLogo from '../../../assets/img/exdevlogo.png';
import ExdevSoloLogo from '../../../assets/img/exdev-solologo.png';

function Header(){
    const [theme, setTheme] = useState(() =>{
        return localStorage.getItem('theme') || 'dark';
    } );
    useEffect(() => {
        document.body.classList.toggle('light', theme === 'light');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light': 'dark'));
    }
    return(
        <header className="header">
            <div className="logo-container">
                <a href="/">
                <picture>
                    <source srcSet={ExdevSoloLogo} media="(max-width: 650px)" />
                    <img src={ExdevLogo} alt="Logo Exdev" className="exdev-logo" />
                </picture>
                </a>
            </div>
            <nav className="nav">
                
                <a href='/' title='Ir a inicio'>Inicio</a>
                <a href='/about' title='Sobre nosotros'>Nosotros</a>
                <a href='/apply' title='Sobre nosotros'>Postulaciones</a>
                <button onClick={toggleTheme} className="theme-switch" aria-label="Cambiar tema">
                    <span className="moon-icon"></span>
                    <span className={`switch-thumb ${theme === 'light' ? 'active' : ''}`}></span>
                    <span className="sun-icon"></span>
                </button>
            </nav>
        </header>
    );
}
export default Header;