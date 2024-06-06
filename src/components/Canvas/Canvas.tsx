import { useContext, useEffect, useRef, useState } from 'react';
import useCanvas from '../../hooks/useCanvas';
import DomainContext from '../../store/domainContext';

function Canvas() {

    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>()
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth)
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * (2 / 3))
    const [isIntervalRunning, setIsIntervalRunning] = useState(false)

    const canvasRef = useRef(null)
    const animationFrameIdRef = useRef(-1)
    const increaseStepRef = useRef(5)
    const numberOfSpeedIncreaseRef = useRef(0)
    const intervalRef = useRef<NodeJS.Timer>()

    const { releaseBall, topSpeed, secondsToTopSpeed, setPorcentageTopSpeed } = useContext(DomainContext)

    const { render } = useCanvas({ canvasContext, canvasWidth, canvasHeight, animationFrameIdRef, increaseStepRef, numberOfSpeedIncreaseRef })

    const centerXPoint = canvasWidth / 2
    const centerYPoint = canvasHeight * 0.83


    const getCanvasContext = () => {

        let context: CanvasRenderingContext2D | null = null
        if (canvasRef.current) {
            const canvas = canvasRef.current as HTMLCanvasElement
            context = canvas.getContext("2d")
            if (context) {
                setCanvasContext(context)
            }
        }
        return context
    }

    const resetAnimation = () => {
        window.cancelAnimationFrame(animationFrameIdRef.current)
        render()
    }

    const handleResize = (e: Event) => {
        setCanvasWidth(window.innerWidth)
        setCanvasHeight(window.innerHeight * (2 / 3))
    }

    const initIntervalToIncreaseBarSpeed = () => {

        if(!isIntervalRunning){
            setIsIntervalRunning(true)
            setPorcentageTopSpeed(0)
            intervalRef.current = setInterval(() => {
                if (numberOfSpeedIncreaseRef.current < secondsToTopSpeed) {
                    increaseStepRef.current += topSpeed / secondsToTopSpeed
                    // console.log("increaseStepRef.current: ", increaseStepRef.current)
                    numberOfSpeedIncreaseRef.current++
                    console.log((numberOfSpeedIncreaseRef.current * 100) / secondsToTopSpeed)
                    setPorcentageTopSpeed((numberOfSpeedIncreaseRef.current * 100) / secondsToTopSpeed)
                }
            }, 1000)
        }
    }

    const clearIntervalToIncreaseBarSpeed = () => {
        clearInterval(intervalRef.current)
        setIsIntervalRunning(false)
    }

    useEffect(() => {
        resetAnimation()
        if (releaseBall) {
            clearIntervalToIncreaseBarSpeed()
        }
        else {
            initIntervalToIncreaseBarSpeed()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centerXPoint, centerYPoint, releaseBall, canvasContext])

    useEffect(() => {

        const animationFrameId = animationFrameIdRef.current
        getCanvasContext()

        window.addEventListener("resize", handleResize)

        return () => {
            if (intervalRef.current) {
                clearIntervalToIncreaseBarSpeed()
            }
            window.cancelAnimationFrame(animationFrameId)
            window.removeEventListener("resize", handleResize)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
        </>
    );
}

export default Canvas;