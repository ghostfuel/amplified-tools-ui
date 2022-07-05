import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { FunctionComponent, SyntheticEvent, useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CognitoContext, CognitoContextType } from '../../contexts/CognitoProvider';

const SignInForm: FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setAuthenticated } = useContext(CognitoContext) as CognitoContextType;

    const navigate = useNavigate();

    async function signIn(username: string, password: string) {
        try {
            const user = await Auth.signIn(username, password) as CognitoUser;
            console.log("Successful sign in", user);
            const jwt = user.getSignInUserSession()?.getIdToken().getJwtToken();

            if (jwt) {
                setAuthenticated(true, jwt)
                navigate("/")
            }
        } catch (error: any) {
            console.error("Failed to login", error);

            if (error.code === 'UserNotConfirmedException') {
                await Auth.resendSignUp(username)
            }
        }
    }

    function handleSignIn(event: SyntheticEvent) {
        event.preventDefault();
        signIn(email, password)
    }

    function validateForm() {
        const emailValid = email.length > 0;
        const passwordValid = password.length > 0;
        return emailValid && passwordValid;
    }

    return (
        <Form id="signInForm" onSubmit={handleSignIn} className="mt-3">
            <Form.Group className="mb-3" controlId="email">
                <Form.Control
                    autoFocus
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Control
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <div className="d-flex">
                <Button type="submit" disabled={!validateForm()} className="w-100">
                    Login
                </Button>
            </div>
        </Form>
    )
};


export default SignInForm;