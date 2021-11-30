import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
// import "../scss/Styles.scss";

function Trivia({ username, setGlobalState, startingPoints, charities }) {
    let [question, setQuestion] = useState({});
    let [points, setPoints] = useState(startingPoints || 0);
    let [questionNumber, setQuestionNumber] = useState(0);
    let [selectedCharity, setSelectedCharity] = useState(charities[0].name);

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
                });
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

    return (
        <>
            {question.question ? (
                <div className="trivia-container">
                    <div className="trivia-question">{question.question}</div>
                    <div className="trivia-answers">
                        {shuffle(question.incorrect_answers.concat(question.correct_answer)).map((answer) => (
                            <button
                                className="trivia-answer"
                                onClick={() => {
                                    if (answer === question.correct_answer) {
                                        modifyPoints("increment", 1);
                                    } else {
                                        alert("Incorrect answer!");
                                    }
                                    setQuestionNumber(questionNumber + 1);
                                }}
                            >
                                {answer}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div>{"Loading Question..."}</div>
            )}
            <div className="trivia-container">
                <div className="trivia-points">
                    <div className="trivia-points-text">Points:</div>
                    <div className="trivia-points-number">{points}</div>
                    <div className="trivia-selected-charity">
                        <div className="trivia-selected-charity-text">Selected Charity:</div>
                        <Dropdown
                            options={charities.map((x) => x.name)}
                            onChange={(x) => setSelectedCharity(x.value)}
                            value={selectedCharity}
                            placeholder="Select a charity"
                        />
                        ;
                    </div>
                </div>
                {points > 0 && (
                    <div className="trivia-donate">
                        <button
                            className="trivia-donate-button"
                            onClick={() => {
                                modifyPoints("donate", 0);
                            }}
                        >
                            Donate Points
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Trivia;
