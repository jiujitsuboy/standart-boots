type Point = {
    x: number,
    y: number
}

type RangeInformation = {
    speed: number,
    angle: number,
    height: number,
    travelDistance: number
}

type DomainAppObjs = {
    releaseBall: boolean,
    torque: number,
    topSpeed: number,
    secondsToTopSpeed: number,
    setRangeInformation: Dispatch<SetStateAction<RangeInformation>> | null,
    setPorcentageTopSpeed: Dispatch<SetStateAction<number>> | null,
}