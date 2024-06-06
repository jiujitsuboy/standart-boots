import React, { useEffect, useState } from 'react';
import classes from "./App.module.css"
import Button from './components/Button/Button';
import Canvas from './components/Canvas/Canvas';
import DomainContext from './store/domainContext';
import ProgressBar from './components/ProgressBar/ProgressBar';

export type RangeInformation = {
  speed: number,
  angle: number,
  height: number,
  travelDistance: number
}

const emptyRangeInformation = {
  speed: 0,
  angle: 0,
  height: 0,
  travelDistance: 0
}

function App() {
  const [releaseBall, setReleaseBall] = useState(false)
  const [rangeInformation, setRangeInformation] = useState<RangeInformation>(emptyRangeInformation)
  const [porcentageTopSpeed, setPorcentageTopSpeed] = useState(0)
  const [torque, setTorque] = useState(20)
  const [topSpeed, setTopSpeed] = useState(20)
  const [secondsToTopSpeed, setSecondsToTopSpeed] = useState(10)


  const domainAppObjs: DomainAppObjs = {
    releaseBall,
    torque,
    topSpeed,
    secondsToTopSpeed,
    setRangeInformation,
    setPorcentageTopSpeed
  }


  const releaseBallHandler = () => {
    setReleaseBall(prev => !prev)
  }

  return (
    <div className={classes.container}>
      <DomainContext.Provider value={domainAppObjs}>
        <Canvas />
      </DomainContext.Provider>
      <div className={classes.launch_button}>
        <Button label={releaseBall ? "Reset" : "Launch"} buttonHandler={releaseBallHandler} />
      </div>
      <div className={classes.info}>
        <div className={`${classes.round_box} ${classes.motor_specification}`}>
          <span className={classes.round_box__legend}>Engine Specifications</span>
          <div>
            <span>Torque</span>
            <input id="torque" type="number" min={0} value={torque} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTorque(+e.target.value)} />
          </div>
          <div>
            <span>Top Speed</span>
            <input id="topSpeed" type="number" min={0} value={topSpeed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopSpeed(+e.target.value)} />
          </div>
          <div>
            <span>Second to Top Speed</span>
            <input id="secondsTopSpeed" type="number" min={0} value={secondsToTopSpeed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSecondsToTopSpeed(+e.target.value)} />
          </div>
          <ProgressBar porcentage={porcentageTopSpeed} />
        </div>
        <div className={`${classes.round_box} ${classes.result}`}>
          <span className={classes.round_box__legend}>Results</span>
          <div>
            <span>Travel Distance(m)</span>
            <input id="travelDistance" type="text" value={rangeInformation.travelDistance.toFixed(2)} readOnly />
          </div>
          <div>
            <span>Speed(km/h)</span>
            <input id="speed" type="text" value={rangeInformation.speed.toFixed(2)} readOnly />
          </div>
          <div>
            <span>Angle</span>
            <input id="angle" type="text" value={rangeInformation.angle.toFixed(2)} readOnly />
          </div>
          <div>
            <span>Height(m)</span>
            <input id="height" type="text" value={rangeInformation.height.toFixed(2)} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
