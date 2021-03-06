import React from 'react';
import Challenge from '../Challenge/Challenge';
import Footer from '../Footer/Footer';
import Landing from '../Landing/Landing';
import Nav from '../Nav/Nav';
import './App.css';

const TotalTime = 60;
const ServiceUrl = "https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=text";
const defaultState = {
    selectedParagraph: " ",
    timerstarted: false,
    timeRemaining: TotalTime,
    words: 0,
    characters: 0,
    wpm: 0,
    testInfo: []
};

class App extends React.Component {
    state = defaultState;

    fetchNewParagraph = () => {
        fetch(ServiceUrl)
            .then(response => response.text())
            .then((data) => {
                const selectedParagrapharray = data.split("");
                const testInfo = selectedParagrapharray.map((selectedLetter) => {
                    return {
                        testLetter: selectedLetter,
                        status: "notAttempted"
                    };
                });
                this.setState({...defaultState, testInfo, selectedParagraph: data });
            });
    };

    componentDidMount() {
        this.fetchNewParagraph();
    }

    startTimer = () => {
        this.setState({ timerstarted: true });
        const timer = setInterval(() => {
            if (this.state.timeRemaining > 0) {
                const timeSpent = TotalTime - this.state.timeRemaining;
                const wpm = timeSpent > 0 ? (this.state.words / timeSpent) * TotalTime : 0;
                this.setState({
                    timeRemaining: this.state.timeRemaining - 1,
                    wpm: parseInt(wpm)
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);
    };

    startAgain = () => {
        this.fetchNewParagraph();
    }

    handleUserInput = (inputValue) => {
        if (!this.state.timerstarted) this.startTimer();

        const characters = inputValue.length;
        const words = inputValue.split(" ").length;
        const index = characters - 1;

        if (index < 0) {
            this.setState({
                testInfo: [{
                        testLetter: this.state.testInfo[0].testLetter,
                        status: "notAttempted"
                    },
                    ...this.state.testInfo.slice(1)
                ],
                characters,
                words,
            });
            return;
        }

        if (index >= this.state.selectedParagraph.length) {
            this.setState({ characters, words });
            return;
        }

        const testInfo = this.state.testInfo;
        if (!(index === this.state.selectedParagraph.length - 1)) {
            testInfo[index + 1].status = "notAttempted";
        }

        // Check for correct typed
        const isMistake = inputValue[index] === testInfo[index].testLetter;

        // updating testInfo
        testInfo[index].status = isMistake ? "correct" : "incorrect";

        // updating the state
        this.setState({
            testInfo,
            words,
            characters
        });
    };

    render() {

        return ( 
            <div className = "app">
            <Nav />
            <Landing />

            <Challenge 
            selectedParagraph = { this.state.selectedParagraph }
            words = { this.state.words }
            characters = { this.state.characters }
            wpm = { this.state.wpm }
            timeRemaining = { this.state.timeRemaining }
            timerstarted = { this.state.timerstarted }
            testInfo = { this.state.testInfo }
            oninputchange = { this.handleUserInput }
            startAgain = { this.startAgain }
            />

            <Footer />
            </div>
        );
    }
}

export default App;
