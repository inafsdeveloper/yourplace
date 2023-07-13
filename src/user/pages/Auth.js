import React, { useContext, useState } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import './Auth.css';

const backend = config.backend;
const backendServerUrl = backend.baseServerUrl + ":" + backend.port;
const userRoute = backend.userRoute;

const Auth = props => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = async event => {
        event.preventDefault();
        // console.log("Authenticating");
        // console.log(formState.inputs);
        const signupUrl = backendServerUrl + userRoute.baseUrl + userRoute.signup.path;

        let response;
        let responseData;
        try {
            setIsLoading(true);


            if (isLoginMode) {
                console.log('Logging in..');
            } else {
                console.log('Siging Up..');
                console.log(signupUrl);
                console.log(userRoute.signup.method);
                console.log(formState);
                response = await fetch(signupUrl, {
                    method: userRoute.signup.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                });
                console.log(response.status);
                responseData = await response.json();
                console.log(responseData);
                setIsLoading(false);
                auth.login();
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setError(err.message || 'Something went wrong, please try again.');
        }
    };

    const swithModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid & formState.inputs.password.isValid
            );

        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    }

    return (
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay/>}
            <h2> Login User</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode &&
                    <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please provide a valid uses name."
                        onInput={inputHandler}
                    />
                }
                <Input
                    id="email"
                    element="input"
                    type="email"
                    label="E-Mail"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please provide a valid email address."
                    onInput={inputHandler}
                />
                <Input
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please provide a password, at least 5 characters."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button>
            </form>
            <Button inverse onClick={swithModeHandler}>
                SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
            </Button>
        </Card>
    );
}

export default Auth;