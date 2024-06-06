import { createContext } from "react"

const domainObjs: DomainAppObjs = {
    releaseBall: false,
    torque: 20,
    topSpeed: 20,
    secondsToTopSpeed: 10,
    setRangeInformation: null,
    setPorcentageTopSpeed: null
}

const DomainContext = createContext(domainObjs)

export default DomainContext