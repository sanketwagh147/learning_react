// import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import navClasses from '../components/MainNavigation.module.css';
function MainNavigation() {

  const isActiveLink = ({ isActive }) => {
    if (isActive) {
      return navClasses.active;
    }
    return undefined;
  };
  return (
    <header className={navClasses.header}>
      <nav>
        <ul className={navClasses.list}>
          <li>
            <NavLink to="/" className={isActiveLink}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/products" className={isActiveLink}>Products</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
