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
                setGlobalState(0);
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
                setCharities(
                    json.charities
                        .sort(function (a, b) {
                            return b.totalDonated - a.totalDonated;
                        })
                        .map((x) => ({ name: x.charityName, totalDonated: x.totalDonated, profilePicture: x.profilePicture }))
                );
            })
            .catch((error) => {
                console.error("Failed to get charities:", error);
            });
    }, [globalState]);

    let mockAdsLink = [
        "https://i.imgur.com/0wy0klx.png",
        "https://i.imgur.com/FP66qBs.png",
        "https://i.imgur.com/EH6SaYs.png",
        "https://i.imgur.com/4JTBeIN.png",
        "https://i.imgur.com/fmwIySQ.png",
    ];

    return (
        <>
            {dataRecieved === 1 && charities.length > 0 ? (
                <div className="dashboard">
                    <Trivia username={userData.username} setGlobalState={setGlobalState} startingPoints={userData.points} charities={charities} />
                    <div className="leaderboards">
                        <div className="charities-leaderboard">
                            <div className="charities-leaderboard-inner">
                                <div className="charities-leaderboard-header">Charities Leaderboard</div>
                                <div className="charities-leaderboard-body-top3">
                                    {charities.slice(0, 3).map((x, i) => (
                                        <div className="charities-leaderboard-top3" key={i}>
                                            <div className="charities-leaderboard-row-picture" style={{ position: "relative" }}>
                                                <img
                                                    src={x.profilePicture}
                                                    alt={`Profile Pic for ${x.name}`}
                                                    style={{
                                                        width: "5vw",
                                                        height: "5vw",
                                                        monWidth: "10rem",
                                                        minWidth: "4rem",
                                                        minHeight: "4rem",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                <div
                                                    className="charities-ranking-top3"
                                                    style={{ backgroundColor: i === 0 ? "#57c795" : i === 1 ? "#867df9" : "#db386c" }}
                                                >
                                                    {i + 1}
                                                </div>
                                            </div>
                                            <div className="charities-leaderboard-row-name">{x.name}</div>
                                            <div className="charities-leaderboard-row-points">{x.totalDonated + " Points"}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="charities-leaderboard-body">
                                    {charities.slice(3).map((x, i) => (
                                        <div className="charities-leaderboard-row" key={i}>
                                            <div className="charities-leaderboard-row-picture" style={{ marginRight: "0.5rem" }}>
                                                <img
                                                    src={x.profilePicture}
                                                    alt={`Profile Pic for ${x.name}`}
                                                    style={{
                                                        width: "3vw",
                                                        height: "3vw",
                                                        maxWidth: "10rem",
                                                        minWidth: "3rem",
                                                        minHeight: "3rem",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </div>
                                            <div className="charities-leaderboard-row-name" style={{ marginRight: "0.5rem" }}>
                                                {x.name}
                                            </div>
                                            <div className="charities-leaderboard-row-points">{x.totalDonated + " Points"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="trivia-container-ads">
                        <div
                            className="trivia-container-ads-inner"
                            // style={{ backgroundImage: `url(${mockAdsLink[Math.floor(Math.random() * mockAdsLink.length)]})` }}
                        >
                            <img
                                src={mockAdsLink[Math.floor(Math.random() * mockAdsLink.length)]}
                                alt="ad"
                                style={{ width: "89vw", height: "auto", maxWidth: "40rem" }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div>{dataRecieved === 0 ? "Loading..." : "Unauthorized access"}</div>
            )}
        </>
    );
}

export default DashboardPage;
