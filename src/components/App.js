import React, { useState, useEffect, useRef } from "react";
import Circular from "./circular";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faPlay,
  faStop,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";

// formate one number to two digits formats e.g 1 => 01
let formattedNumber = (number) =>
  number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [breakMins, setBreakMins] = useState(breakLength);
  const [breakSecs, setBreakSesc] = useState(0);
  const [sessionLength, setSessionLength] = useState(2);
  const [sessionMins, setSessionMins] = useState(sessionLength);
  const [sessionSecs, setSessionSesc] = useState(0);

  const [startTimer, setStartTimer] = useState(false);
  const [runBreak, setRunBreak] = useState(false);

  const [secondsToCircularTimer, setSecondsToCircularTimer] = useState(
    sessionMins * 60 + sessionSecs
  );

  const [key, setKey] = useState(0);

  const audio = useRef(null);

  const unitDecreament = (unit, updateValue) => {
    unit === 1 ? updateValue(1) : updateValue(unit - 1);
  };
  const unitIncrement = (unit, updateValue) => {
    unit === 60 ? updateValue(60) : updateValue(unit + 1);
  };

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setRunBreak(false);
    setStartTimer(false);
    setSessionMins(sessionLength);
    setSessionSesc(0);
    setBreakMins(breakLength);
    setBreakSesc(0);
    audio.current.pause();
    audio.current.currentTime = 0;
  };

  console.log({ sessionMins });
  console.log({ sessionSecs });
  console.log({ secondsToCircularTimer });

  // useEffect(() => {
    
  // }, [sessionLength]);

  // update session minutes and seconds when session length changes
  useEffect(() => {
    setSessionMins(sessionLength);
    setSessionSesc(0);
    if(!runBreak) {
      setSecondsToCircularTimer(sessionLength * 60);
      setKey((prevKey) => prevKey + 1);
    }
  }, [sessionLength, runBreak]);

  useEffect(() => {
    setBreakMins(breakLength);
    setBreakSesc(0);
  }, [breakLength]);

  useEffect(() => {
    if (runBreak) {
      setSecondsToCircularTimer(breakLength * 60);
      setKey((prevKey) => prevKey + 1);
    }
  
  }, [breakLength, runBreak])
  

  // Session timer
  useEffect(() => {
    let timer;
    if (startTimer) {
      timer = setInterval(() => {
        if (sessionMins === 0 && sessionSecs === 1) {
          audio.current.play();
        }
        if (sessionMins === 0 && sessionSecs === 0) {
          if (!runBreak) {
            setBreakMins(breakLength);
            setBreakSesc(0);
          }
          setRunBreak(true);
          clearInterval(timer);
        } else {
          if (sessionSecs === 0) {
            setSessionSesc(59);
            setSessionMins(sessionMins - 1);
          } else {
            setSessionSesc(sessionSecs - 1);
          }
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [breakLength, runBreak, sessionMins, sessionSecs, startTimer]);

  // Break timer
  useEffect(() => {
    let timer;
    if (startTimer && runBreak) {
      timer = setInterval(() => {
        if (breakMins === 0 && breakSecs === 0) {
          audio.current.play();
        }
        if (breakMins === 0 && breakSecs === 0) {
          setSessionMins(sessionLength);
          setSessionSesc(0);
          setRunBreak(false);
          clearInterval(timer);
        } else {
          if (breakSecs === 0) {
            setBreakMins(breakMins - 1);
            setBreakSesc(59);
          } else {
            setBreakSesc(breakSecs - 1);
          }
        }
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [breakMins, breakSecs, runBreak, sessionLength, startTimer]);

  return (
    <>
      <div className="promodoro_container">
        <audio id="beep" ref={audio}>
          <source
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
            type="audio/mpeg"
          />
        </audio>
        <h2 className="title">promodoro technique clock</h2>
        <div className="clock_length_control">
          <div className="break_length">
            <h4 id="break-label">Break Length</h4>
            <div className="length_control_container">
              <span
                id="break-decrement"
                onClick={() => unitDecreament(breakLength, setBreakLength)}
              >
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
              <span
                id="session-decrement"
                onClick={() => unitDecreament(sessionLength, setSessionLength)}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </span>
              <span id="session-length">{sessionLength}</span>
              <span
                id="session-increment"
                onClick={() => unitIncrement(sessionLength, setSessionLength)}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </span>
            </div>
          </div>
        </div>
        <div className="session_box">
          <h4 id="timer-label">{runBreak ? "Break" : "Session"}</h4>
          <span id="time-left">
            {runBreak
              ? `${formattedNumber(breakMins)}:${formattedNumber(breakSecs)}`
              : `${formattedNumber(sessionMins)}:${formattedNumber(sessionSecs)}`}
          </span>
          <CountdownCircleTimer
            key={key}
            isPlaying={startTimer}
            duration={secondsToCircularTimer}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[7, 5, 2, 0]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
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

     
    </>
  );
}
