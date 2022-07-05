import { Auth } from 'aws-amplify';
import { FunctionComponent, SyntheticEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const SignUpForm: FunctionComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigate = useNavigate();

    async function submitSignUpForm(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const { user } = await Auth.signUp({ username: email, password });
            console.log("Successful sign up", user);
            navigate("/verify", { replace: true, state: { email } })
        } catch (error: unknown) {
            console.log("Error signing up:", error);
        }

    }

    function validatePassword() {
        // Password must be 8 Characters, at least 1 of each; Uppercase, Lowercase, Special
        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return passwordPolicy.test(password);
    }

    function validateForm() {
        const emailValid = email.length > 0;
        const passwordValid = validatePassword() && passwordConfirmation === password;
        return emailValid && passwordValid;
    }

    return (
        <Form id="signUpForm" onSubmit={submitSignUpForm} className="mt-3" noValidate>
            <Form.Group className="mb-3" controlId="signUpEmail">
                <Form.Control
                    autoFocus
                    type="email"
                    autoComplete="off"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                    An email address is required
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signUpPassword">
                <Form.Control
                    type="password"
                    autoComplete="off"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    isValid={password !== "" && validatePassword()}
                    isInvalid={password !== "" && !validatePassword()}
                />
                <Form.Control.Feedback type="invalid">
                    Passwords must be longer than 8 characters, including at least one lowercase, uppercase and special character
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signUpPasswordConfirmation">
                <Form.Control
                    type="password"
                    autoComplete="off"
                    value={passwordConfirmation}
                    placeholder="Confirm Password"
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    isValid={password !== "" && password === passwordConfirmation}
                    isInvalid={validatePassword() ? password !== "" && password !== passwordConfirmation : false}
                />
                <Form.Control.Feedback type="invalid">
                    Passwords must match
                </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex">
                <Button type="submit" disabled={!validateForm()} className="w-100">
                    Create Account
                </Button>
            </div>
        </Form>
    )
};


export default SignUpForm;