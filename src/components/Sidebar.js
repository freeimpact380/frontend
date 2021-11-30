import React, { useState } from "react";
import styled from "styled-components";
import logo from "../assets/Logo.png";
import Input from "./Input";

const Sidebar = () => {
    const username = React.useRef(null);
    const password = React.useRef(null);
    const [loggingIn, setLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let login = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"}/users/${loggingIn ? "login" : "signup"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.current.value,
                password: password.current.value,
            }),
            credentials: "include",
        });
        let json = await login.json();
        if (login.status === 200) {
            console.log("Login success:", json);
            window.location.href = "/dashboard";
        } else {
            console.error(json.message || "Login failed");
        }
    };

    return (
        <Container>
            <LogoWrapper>
                <img src={logo} alt="" />
            </LogoWrapper>
            <Form onSubmit={handleSubmit}>
                <h2>Sign Up Or Login</h2>
                <h3>Make A Difference, Starting Today!</h3>
                <Input type="email" placeholder="Email Address" required ref={username} />
                <Input type="password" placeholder="Password" required ref={password} />
                <div style={{ display: "flex" }}>
                    <button onClick={() => setLoggingIn(false)}>Signup</button>
                    <button onClick={() => setLoggingIn(true)}>Login</button>
                </div>
            </Form>
            <div>
                <Terms>©2021 All Rights Reserved.</Terms>
            </div>
        </Container>
    );
};

const Terms = styled.p`
    padding: 0 5rem;
    text-align: center;
    font-size: 15px;
    color: #808080;
    font-weight: 300;
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h3 {
        color: #000;
        margin-bottom: 5rem;
    }

    button {
        width: 75%;
        max-width: 100px;
        min-width: 100px;
        height: 50px;
        border: none;
        margin: 1rem 1rem;
        box-shadow: 0px 14px 19px -5px rgba(0, 0, 0, 0.25);
        border-radius: 18px;
        background-color: #f0785d;
        color: #fff;
        font-weight: 1000;
        cursor: pointer;
        transition: all 0.2s ease-in;

        &:hover {
            transform: translateY(-13px);
        }
    }
`;

const LogoWrapper = styled.div`
    img {
        height: 20rem;
    }

    h3 {
        color: #000;
        text-align: center;
        font-size: 20px;
    }

    span {
        color: #5dc399;
        font-weight: 300;
        font-size: 18px;
    }
`;

const Container = styled.div`
    min-width: 450px;
    backdrop-filter: blur(35px);
    background-color: rgba(253, 187, 176, 1);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: 10 2rem;

    @media (max-width: 900px) {
        width: 100vw;
        position: absolute;
        padding: 0;
    }

    h4 {
        color: #808080;
        font-weight: bold;
        font-size: 17px;
        margin-top: 2rem;

        span {
            color: #ff8d8d;
            cursor: pointer;
        }
    }
`;

export default Sidebar;
