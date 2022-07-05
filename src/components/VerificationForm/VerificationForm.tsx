import { Auth } from 'aws-amplify';
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';


const VerificationForm: FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerifcationCode] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Load email from Router state if able
        if (location.state) {
            const state = location.state as { email: string };
            if (state.email) setEmail(state.email);
        }
    }, [location.state]);

    async function handleNewVerificationCode(event: SyntheticEvent) {
        event.preventDefault();

        try {
            const { user } = await Auth.resendSignUp(email);
            console.log("Successfully requested new code", user);
        } catch (error: any) {
            console.log("Error requesting a new code:", error);
        }
    }

    async function submitVerificationForm(event: SyntheticEvent) {
        event.preventDefault();

        try {
            const { user } = await Auth.confirmSignUp(email, verificationCode);
            console.log("Successful verification", user);
            navigate("/sign-in", { replace: true })
        } catch (error: any) {
            console.log("Error verifying sign up:", error);
        }
    }

    return (
        <Container style={{ width: '25rem' }}>
            <Form id="verificationForm" onSubmit={submitVerificationForm} className="mt-5">
                <Form.Label className="text-center">
                    We've sent you a verification code to your email address, enter to complete sign up!
                </Form.Label>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Control
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="verificationCode">
                    <Form.Control
                        type="code"
                        value={verificationCode}
                        placeholder="Verification Code"
                        onChange={(e) => setVerifcationCode(e.target.value)}
                    />
                </Form.Group>
                <div className="d-flex mb-3">
                    <Button type="submit" disabled={verificationCode.length < 6} className="w-100">
                        Verify
                    </Button>
                </div>
                <div className="text-center">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    Didn't get a code?<br /> Check your spam or <a className="btn-link" role="button" onClick={handleNewVerificationCode}>request a new code</a>
                </div>
            </Form>
        </Container>
    )
};


export default VerificationForm;