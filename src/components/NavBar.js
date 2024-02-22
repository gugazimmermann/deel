import NavBarLink from "./NavBarLink";

const NavBar = () => {
  return (
    <nav className="flex flex-row gap-4 ml-4">
      <NavBarLink text="contracts" link="/" />
      <NavBarLink text="jobs" link="/jobs" />
      <NavBarLink text="balances" link="/balances" />
      <NavBarLink text="admin" link="/admin" />
    </nav>
  );
};

export default NavBar;
