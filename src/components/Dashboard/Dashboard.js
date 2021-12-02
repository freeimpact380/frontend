import React, { useState, useEffect } from "react";
import Trivia from "./Trivia/Trivia";
import "./Dashboard.css";

// import "../scss/Styles.scss";

function DashboardPage() {
    let [userData, setUserData] = useState({});
    let [dataRecieved, setDataRecieved] = useState(0);
    let [globalState, setGlobalState] = useState(0);
    let [charities, setCharities] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"}/users/info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) return res;
                else throw new Error(res);
            })
            .then((res) => res.json())
            .then((json) => {
                setUserData(json.user || {});
                setDataRecieved(1);
            })
            .catch((error) => {
                console.error("Failed to get user data");
                setDataRecieved(2);
            });
    }, [globalState]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"}/charities/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.status === 200) return res;
                else throw new Error(res);
            })
            .then((res) => res.json())
            .then((json) => {
                setCharities(json.charities.map((x) => ({ name: x.charityName, totalDonated: x.totalDonated })));
            })
            .catch((error) => {
                console.error("Failed to get charities:", error);
            });
    }, []);

    return (
        <>
            {dataRecieved === 1 && charities.length > 0 ? (
                <div className="dashboard">
                    <Trivia username={userData.username} setGlobalState={setGlobalState} startingPoints={userData.points} charities={charities} />
                </div>
            ) : (
                <div>{dataRecieved === 0 ? "Loading..." : "Unauthorized access"}</div>
            )}
        </>
    );
}

export default DashboardPage;
