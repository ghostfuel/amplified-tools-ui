
import { FunctionComponent, useState } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import SignInForm from '../../components/SignInForm/SignInForm';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

import "./SignIn.css";

const SignIn: FunctionComponent = () => {
    const [formType] = useState<"signIn" | "signUp" | "verification">("signIn")

    return (
        <Container style={{ width: '25rem' }}>
            <Tabs defaultActiveKey={formType} id="cognito-login-tabs" className="nav-fill nav-pills" style={{ border: "none" }}>
                <Tab eventKey="signIn" title="Sign In">
                    <SignInForm />
                </Tab>
                <Tab eventKey="signUp" title="Sign Up">
                    <SignUpForm />
                </Tab>
            </Tabs>
        </Container>
    )
};


export default SignIn;