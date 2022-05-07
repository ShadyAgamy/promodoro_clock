import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPlay, faStop, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [currentTime, setCurrentTime] = useState(sessionLength);
  const [startTimer, setStartTimer] = useState(false);

  const unitDecreament = (unit, updateValue) => {
    unit === 1 ? updateValue(1) : updateValue(unit - 1);
  };
  const unitIncrement = (unit, updateValue) => {
    unit === 60 ? updateValue(60) : updateValue(unit + 1);
  };
  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
  };

  let mins = sessionLength;
  let sec = "00";

  useEffect(() => {
    let timer;
    if (startTimer) {
       timer = setInterval(() => {
        if (sec == "00") {
          mins = mins - 1;
          sec = 59;
        } else {
          sec = sec - 1;
        }
        if (mins === 0 && sec == "00") {
          clearTimeout(timer);
        }
        console.log({ mins });
        console.log({ sec });
        setCurrentTime(`${mins} : ${sec}`);
      }, 1000);
     
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [startTimer]);

  return (
    <div className="promodoro_container">
      <h2 className="title">promodoro technique clock</h2>
      <div className="clock_length_control">
        <div className="break_length">
          <h4 id="break-label">Break Length</h4>
          <div className="length_control_container">
            <span id="break-decrement" onClick={() => unitDecreament(breakLength, setBreakLength)}>
              <FontAwesomeIcon icon={faArrowDown} />
            </span>
            <span id="break-length">{breakLength}</span>
            <span id="break-increment" onClick={() => unitIncrement(breakLength, setBreakLength)}>
              <FontAwesomeIcon icon={faArrowUp} />
            </span>
          </div>
        </div>
        <div className="session_length">
          <h4 id="session-label">Session Length</h4>
          <div className="length_control_container">
            <span id="session-decrement" onClick={() => unitDecreament(sessionLength, setSessionLength)}>
              <FontAwesomeIcon icon={faArrowDown} />
            </span>
            <span id="session-length">{sessionLength}</span>
            <span id="session-increment" onClick={() => unitIncrement(sessionLength, setSessionLength)}>
              <FontAwesomeIcon icon={faArrowUp} />
            </span>
          </div>
        </div>
      </div>
      <div className="session_box">
        <h4 id="timer-label">Session</h4>
        <span id="time-left">{currentTime}</span>
      </div>
      <div className="timerControl">
        <span id="start_stop" onClick={() => setStartTimer(!startTimer)}>
          <FontAwesomeIcon icon={faPlay} />
          <FontAwesomeIcon icon={faStop} />
        </span>
        <span id="reset" onClick={reset}>
          <FontAwesomeIcon icon={faRotateLeft} />
        </span>
      </div>
    </div>
  );
}
