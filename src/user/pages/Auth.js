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
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { AuthContext } from "../../shared/context/auth-context";
import config from "../../shared/config/config.json";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";


import './Auth.css';

const backend = config.backend;
const backendServerUrl = process.env.REACT_APP_BACKEND_URL;
const userRoute = backend.userRoute;

const Auth = props => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
        console.log(formState.inputs);
        const signupUrl = backendServerUrl + userRoute.baseUrl + userRoute.signup.path;
        const loginUrl = backendServerUrl + userRoute.baseUrl + userRoute.login.path;
        let responseData;
        try {
            if (isLoginMode) {
                responseData = await sendRequest(loginUrl,
                    userRoute.login.method,
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
            } else {
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('image', formState.inputs.image.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                responseData = await sendRequest(signupUrl,
                    userRoute.signup.method,
                    formData
                );
            }
            auth.login(responseData.user.id, responseData.user.token);
        } catch (err) {
            console.log(err);
        }

    };


    const swithModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
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
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    }



    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
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
                    {!isLoginMode && (
                        <ImageUpload
                        id="image"
                        center
                        onInput={inputHandler}
                        errorText="Please provide an image"
                      />)
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
                        validators={[VALIDATOR_MINLENGTH(6)]}
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
        </React.Fragment>
    );
}

export default Auth;