import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./Trivia.css";
// import "../scss/Styles.scss";

function Trivia({ username, setGlobalState, startingPoints, charities }) {
    let [question, setQuestion] = useState({});
    let [points, setPoints] = useState(startingPoints || 0);
    let [questionNumber, setQuestionNumber] = useState(0);
    let [selectedCharity, setSelectedCharity] = useState(charities[0].name);
    let [buttonColor, setButtonColor] = useState({ optionValue: "", color: "#fff" });

    function modifyPoints(operation, amount) {
        fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"}/users/points`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                operation,
                amount,
                charityName: selectedCharity,
            }),
        })
            .then((res) => {
                if (res.status === 200) return res;
                else throw new Error(res);
            })
            .then((res) => res.json())
            .then((json) => {
                setPoints(json.points);
            })
            .catch((error) => {
                console.error("Failed to modify points:", error.message);
                console.error(error);
            });
    }
    useEffect(() => {
        fetch(`https://tpbcors.herokuapp.com/https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986`, {
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
                console.log(decodeURIComponent(json.results[0].question), decodeURIComponent(json.results[0].correct_answer));
                setQuestion({
                    question: decodeURIComponent(json.results[0].question),
                    correct_answer: decodeURIComponent(json.results[0].correct_answer),
                    incorrect_answers: json.results[0].incorrect_answers.map((answer) => decodeURIComponent(answer)),
                    options: shuffle(
                        json.results[0].incorrect_answers.map((answer) => decodeURIComponent(answer)).concat(decodeURIComponent(json.results[0].correct_answer))
                    ),
                });
                setButtonColor({ optionValue: "", color: "#fff" });
            })
            .catch((error) => {
                console.error("Failed to get trivia questions:", error);
            });
    }, [questionNumber]);

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    let mockAdsLink = [
        "https://i.imgur.com/WmKXawZ.png",
        "https://i.imgur.com/FP66qBs.png",
        "https://i.imgur.com/EH6SaYs.png",
        "https://i.imgur.com/4JTBeIN.png",
    ];

    return (
        <>
            {question.question ? (
                <div className="trivia-container-question">
                    <div className="trivia-container-question-inner">
                        <div className="trivia-question">{question.question}</div>
                        <div className="trivia-answers">
                            {question.options.map((answer) => (
                                <button
                                    className="trivia-answer"
                                    style={{ backgroundColor: buttonColor.optionValue === answer ? buttonColor.color : "#fff" }}
                                    onClick={() => {
                                        if (answer === question.correct_answer) {
                                            modifyPoints("increment", 1);
                                            setButtonColor({ optionValue: answer, color: "#50c996" });
                                        } else {
                                            setButtonColor({ optionValue: answer, color: "#ee98b4" });
                                        }
                                        setTimeout(() => {
                                            setQuestionNumber(questionNumber + 1);
                                        }, 2000);
                                    }}
                                    disabled={buttonColor.color !== "#fff"}
                                    key={answer}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div>{"Loading Question..."}</div>
            )}
            <div className="trivia-container-points">
                <div className="trivia-container-points-inner">
                    <div className="trivia-points">
                        <div className="trivia-points-wrapper">
                            <div className="trivia-points-text">Points: {points}</div>
                        </div>
                        <div
                            className="trivia-selected-charity"
                            style={{ borderRight: points > 0 ? "1px lightgray solid" : "none", paddingRight: points > 0 ? "1rem" : "0" }}
                        >
                            <div className="trivia-selected-charity-text">Selected Charity:</div>
                            <Dropdown
                                options={charities.map((x) => x.name)}
                                onChange={(x) => setSelectedCharity(x.value)}
                                value={selectedCharity}
                                placeholder="Select a charity"
                            />
                        </div>
                        {points > 0 && (
                            <div className="trivia-donate">
                                <button
                                    className="glow-on-hover"
                                    onClick={() => {
                                        modifyPoints("donate", 0);
                                    }}
                                >
                                    Donate Points
                                </button>
                            </div>
                        )}
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
        </>
    );
}

export default Trivia;
