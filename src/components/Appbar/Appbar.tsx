import { Auth } from 'aws-amplify';
import { FunctionComponent, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoContext, CognitoContextType } from '../../contexts/CognitoProvider';

type AppBarProps = {
  logo: string;
  title: string;
}

const Appbar: FunctionComponent<AppBarProps> = (props) => {
  const { isAuthenticated, setAuthenticated } = useContext(CognitoContext) as CognitoContextType;

  const navigate = useNavigate();
  const location = useLocation();

  async function signOut() {
    try {
      await Auth.signOut();
      setAuthenticated(false);
    } catch (error: unknown) {
      console.log("Error signing out:", error);
    }
  }

  function logOutClick() {
    signOut()
    navigate("/sign-in")
  }

  function loginClick() {
    navigate("/sign-in")
  }

  return (<nav className="navbar navbar-dark bg-dark">
    <div className="container-fluid">
      <a className="navbar-brand" href="/">
        <img
          alt="logo"
          src={props.logo}
          width="30"
          height="30"
          style={{ marginRight: '10px' }}
          className="d-inline-block align-top" />
        {props.title}
      </a>
      {/* {dev} */}
      {isAuthenticated && (<Button variant="dark" type="button" className="text-light" onClick={logOutClick}>Logout</Button>)}
      {!isAuthenticated && ["/signup"].includes(location.pathname) && (<Button variant="dark" type="button" className="text-light" onClick={loginClick}>Login</Button>)}
    </div>
  </nav>)
};


export default Appbar;