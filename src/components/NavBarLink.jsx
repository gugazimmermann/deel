import { NavLink } from "react-router-dom";

const NavBarLink = ({ text, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `capitalize ${
          isActive ? "text-blue-900 font-bold" : "text-slate-500"
        }`
      }
    >
      {text}
    </NavLink>
  );
};

export default NavBarLink;
