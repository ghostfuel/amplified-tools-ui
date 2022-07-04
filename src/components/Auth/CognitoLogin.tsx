import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { FunctionComponent, SyntheticEvent, useContext, useState } from 'react';
import { Button, Container, Form, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CognitoContext, CognitoContextType } from '../../contexts/CognitoProvider';

import "./CognitoLogin.css";

type CognitoLoginFormTypes = "signIn" | "signUp" | "verification"

const CognitoLogin: FunctionComponent = () => {
    const [formType, setFormType] = useState<CognitoLoginFormTypes>("signIn")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [verificationCode, setVerifcationCode] = useState("");

    const [error, setError] = useState<{ error: string }>();

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
            } else if (error.code === 'NotAuthorizedException') {
                // The error happens when the incorrect password is provided
                setError({ error: 'Login failed.' })
            } else if (error.code === 'UserNotFoundException') {
                // The error happens when the supplied username/email does not exist in the Cognito user pool
                setError({ error: 'Login failed.' })
            } else {
                setError({ error: 'An error has occurred.' })
            }
        }
    }

    function handleSignIn(event: SyntheticEvent) {
        event.preventDefault();
        signIn(email, password)
    }

    async function signUp(username: string, password: string) {
        try {
            const { user } = await Auth.signUp({ username, password });
            console.log("Successful sign up", user);
            setFormType("verification")
            // TODO: Handle verification code
            // await Auth.confirmSignUp();
            // await Auth.resendSignUp();
        } catch (error: any) {
            console.log("Error signing up:", error);
        }
    }


    function handleSignUp(event: SyntheticEvent) {
        event.preventDefault();
        signUp(email, password)
    }

    // TODO: Handle resend
    // await Auth.resendSignUp();

    async function handleVerification(event: SyntheticEvent) {
        event.preventDefault();

        try {
            const { user } = await Auth.confirmSignUp(email, verificationCode);
            console.log("Successful verification", user);
            setFormType("signIn")
            signIn(email, password)
        } catch (error: any) {
            console.log("Error verifying sign up:", error);
        }
    }

    async function handleNewVerificationCode(event: SyntheticEvent) {
        event.preventDefault();

        try {
            const { user } = await Auth.resendSignUp(email);
            console.log("Successfully requested new code", user);
            setFormType("verification")
        } catch (error: any) {
            console.log("Error requested a new code:", error);
        }
    }

    function validatePassword() {
        // Password must be 8 Characters, at least 1 of each; Uppercase, Lowercase, Special
        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return passwordPolicy.test(password);
    }

    function validateForm() {
        const emailValid = email.length > 3;
        let passwordValid = password.length > 0;

        if (formType === "verification") {
            passwordValid = passwordValid && passwordConfirmation === password;
        }

        return emailValid && passwordValid;
    }

    return (
        <Container style={{ width: '25rem' }}>
            <Tabs defaultActiveKey={formType} id="cognito-login-tabs" className="nav-fill nav-pills" style={{ border: "none" }}>
                <Tab eventKey="signIn" title="Sign In">
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
                </Tab>
                <Tab eventKey="signUp" title="Sign Up">
                    <Form id="signUpForm" onSubmit={handleSignUp} className="mt-3">
                        <Form.Group className="mb-3" controlId="signUpEmail">
                            <Form.Control
                                autoFocus
                                type="email"
                                value={email}
                                placeholder="Email"
                                disabled={formType === "verification"}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={email.length === 0}
                            />
                            <Form.Control.Feedback type="invalid">An email address is required</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="signUpPassword">
                            <Form.Control
                                type="password"
                                value={password}
                                placeholder="Password"
                                disabled={formType === "verification"}
                                onChange={(e) => setPassword(e.target.value)}
                                isValid={validatePassword()}
                                isInvalid={!validatePassword()}
                            />
                            <Form.Control.Feedback type="invalid">Passwords must be longer than 8 characters, including at least one lowercase, uppercase and special character</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="signUpPasswordConfirmation">
                            <Form.Control
                                type="password"
                                value={passwordConfirmation}
                                placeholder="Confirm Password"
                                disabled={formType === "verification"}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                isValid={password === passwordConfirmation && validatePassword()}
                                isInvalid={password !== passwordConfirmation}
                            />
                            <Form.Control.Feedback type="invalid">Passwords must match</Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex">
                            <Button type="submit" disabled={!validateForm() || formType === "verification"} className="w-100">
                                Create Account
                            </Button>
                        </div>
                    </Form>
                    {formType === "verification" && <Form id="verificationForm" onSubmit={handleVerification} className="mt-5">
                        <Form.Label className="text-center">
                            We've sent you a verification code to your email address, enter to complete sign up!
                        </Form.Label>
                        <Form.Group className="mb-3" controlId="verificationCode">
                            <Form.Control
                                type="code"
                                value={verificationCode}
                                placeholder="Verification Code"
                                onChange={(e) => setVerifcationCode(e.target.value)}
                            />
                        </Form.Group>
                        <div className="d-flex mb-3">
                            <Button type="submit" disabled={!validateForm()} className="w-100">
                                Verify
                            </Button>
                        </div>
                        <div className="text-center">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            Didn't get a code?<br /> Check your spam or <a className="btn-link" role="button" onClick={handleNewVerificationCode}>request a new code</a>
                        </div>
                    </Form>}
                </Tab>
            </Tabs>
        </Container>
    )
};


export default CognitoLogin;