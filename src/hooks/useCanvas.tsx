import { useContext, useRef } from 'react';
import { BALL_WEIGHT, BAR_WEIGHT, GRAVITY, GRAVITY_PIXELS, RADIUS } from '../constant';
import DomainContext from '../store/domainContext';


interface useCanvasProps {
    canvasContext: CanvasRenderingContext2D | undefined,
    canvasWidth: number,
    canvasHeight: number,
    animationFrameIdRef: React.MutableRefObject<number>,
    increaseStepRef: React.MutableRefObject<number>,
    numberOfSpeedIncreaseRef: React.MutableRefObject<number>
}

const useCanvas = ({ canvasContext, canvasWidth, canvasHeight, animationFrameIdRef, increaseStepRef, numberOfSpeedIncreaseRef }: useCanvasProps) => {

    const { releaseBall, torque, secondsToTopSpeed, setRangeInformation } = useContext(DomainContext)

    const xPositionRef = useRef(0)
    const increaseXPositionRef = useRef(true);
    const positiveHeightRef = useRef(true)
    const positiveWidthRef = useRef(true)
    const ballXPositionRef = useRef(0)
    const ballYPositionRef = useRef(0)
    const velocityX = useRef(0)
    const velocityY = useRef(0)
    const ballParamsCalculatedRef = useRef(false)
    const initialAmountSecondsRef = useRef(0)


    const centerXPoint = canvasWidth / 2
    const centerYPoint = canvasHeight * 0.67
    const groundYPoint = centerYPoint + 199
    const squareRadius = Math.pow(RADIUS, 2)


    const armLength = 0.17 // 170mm to mts
    const tensorialProduct = torque * armLength // t = F.r
    const angularAcceleration = Math.sqrt(tensorialProduct / (BAR_WEIGHT + BALL_WEIGHT))// < = t / I

    const drawBackGround = (ctx: CanvasRenderingContext2D | null) => {
        if (ctx) {
            const borderSize = 5
            const canvasWidthSize = ctx.canvas.width
            const canvasHeightSize = ctx.canvas.height
            ctx.fillStyle = "blue";
            ctx.fillRect(1, 1, canvasWidthSize - 2, canvasHeightSize);

            ctx.fillStyle = "rgba(0,0,0,0.9)";
            ctx.fillRect(borderSize, borderSize, canvasWidthSize - ((2 * borderSize)), canvasHeightSize - ((2 * borderSize) - 2));
        }
    }

    var angleBetween = function (p1: Point, p2: Point) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    const clearCanvas = (ctx: CanvasRenderingContext2D | null) => {
        if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
    }

    const drawBaseCircle = (ctx: CanvasRenderingContext2D | null) => {
        if (ctx) {
            ctx.fillStyle = "rgba(0,0,255,0.9)"
            ctx.beginPath();
            ctx.arc(centerXPoint, centerYPoint, RADIUS / 4, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill()
        }
    }

    const drawBasePole = (ctx: CanvasRenderingContext2D | null) => {
        if (ctx) {
            ctx.beginPath();
            ctx.fillStyle = "gray";
            ctx.fillRect(centerXPoint - 4, centerYPoint - RADIUS / 3, 10, RADIUS / 8)
            ctx.fillRect(centerXPoint - 4, centerYPoint + RADIUS / 4, 10, RADIUS / 8)
            ctx.strokeStyle = "gray";
            ctx.stroke();

        }
    }

    const drawBall = (ctx: CanvasRenderingContext2D | null, xPosition: number, yPosition: number) => {
        if (ctx) {
            ctx.fillStyle = "gray";
            ctx.beginPath();
            ctx.arc(xPosition, yPosition, RADIUS / 20, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill()
        }
    }

    const drawSpiningBar = (ctx: CanvasRenderingContext2D | null, xPosition: number, yPosition: number) => {
        if (ctx) {

            ctx.beginPath()
            ctx.moveTo(centerXPoint, centerYPoint)
            ctx.lineTo(xPosition, yPosition)
            ctx.stroke()
        }
    }

    const calculateTravelDistance = (angle: number, speed: number): RangeInformation => {

        const angleCorrection = -1 * (angle + (Math.PI / 2))
        const negativeAngle = -1 * angle
        const angleDegrees = (negativeAngle > 0 ? negativeAngle : (2 * Math.PI + negativeAngle)) * (360 / (2 * Math.PI))
        const angleCorrectionDegrees = (angleCorrection > 0 ? angleCorrection : (2 * Math.PI + angleCorrection)) * (360 / (2 * Math.PI))

        const sinAngle = Math.sin(negativeAngle)
        const sinAngleCorrection = Math.sin(angleCorrection)
        const cosAngleCorrection = Math.cos(angleCorrection)

        let heigthFromGround = 0

        if ((angleDegrees > 0 && angleDegrees < 180) || angleDegrees === 360) {
            heigthFromGround = (Math.abs(sinAngle) * armLength) + armLength
        }
        else {
            heigthFromGround = armLength - (Math.abs(sinAngle) * armLength)
        }

        const vx = speed * cosAngleCorrection
        const vy = speed * sinAngleCorrection

        const heightByGravity = (2 * GRAVITY * heigthFromGround)
        const root = Math.sqrt(Math.pow(vy, 2) + heightByGravity)
        const denominator = (vy + root)
        const flightTime = denominator / GRAVITY

        // xv *  (vy + (vy^2 + 2gh)^0.5)/g
        const range = Math.abs(vx * flightTime)

        return {
            speed,
            angle: angleCorrectionDegrees,
            height: heigthFromGround,
            travelDistance: range
        }
    }

    const calculateBallParams = (centerPointBar: Point, centerPointBall: Point) => {

        if (!ballParamsCalculatedRef.current) {

            const time = new Date().getTime()
            const amoutOfSeconds = (time - initialAmountSecondsRef.current) / 1000

            //After release the ball, reset variables that control speed of the bar
            numberOfSpeedIncreaseRef.current = 0
            increaseStepRef.current = 5
            initialAmountSecondsRef.current = 0
            ballParamsCalculatedRef.current = true

            const seconds = amoutOfSeconds < secondsToTopSpeed ? amoutOfSeconds : secondsToTopSpeed

            let realSpeed = angularAcceleration * seconds
            let angle = angleBetween(centerPointBall, centerPointBar)
            let angleConversion = angle + (Math.PI / 2)

            velocityX.current = Math.cos(angleConversion) * realSpeed;
            velocityY.current = Math.sin(angleConversion) * realSpeed;

            setRangeInformation(calculateTravelDistance(angle, realSpeed))            
        }

    }

    const getRealCoordinates = () => {

        const squareXPosition = Math.pow(xPositionRef.current, 2)
        const netValue = squareRadius - squareXPosition
        let yPosition = Math.sqrt(netValue)

        if (!positiveHeightRef.current) {
            yPosition *= -1
        }

        const realWidth = (centerXPoint + (positiveWidthRef.current ? xPositionRef.current : xPositionRef.current * -1))
        const realHeight = (centerYPoint - yPosition)

        return {
            realWidth,
            realHeight
        }

    }

    const resetValueForNextLaunch = () => {
        ballXPositionRef.current = 0
        ballYPositionRef.current = 0
        ballParamsCalculatedRef.current = false
        initialAmountSecondsRef.current = new Date().getTime()
    }

    const setXPositionIncreaseDecreaseDirection = () => {
        //Handle how to increase the X coordinate of the bar edge (to create the spin of the bar)
        if (!(xPositionRef.current >= 0 && xPositionRef.current <= RADIUS)) {
            increaseXPositionRef.current = !increaseXPositionRef.current
            if (xPositionRef.current > RADIUS) {
                xPositionRef.current = RADIUS
                positiveHeightRef.current = !positiveHeightRef.current
            }
            if (xPositionRef.current < 0) {
                xPositionRef.current = 0
                positiveWidthRef.current = !positiveWidthRef.current
            }
        }
    }

    const drawScene = (ctx: CanvasRenderingContext2D | null, xBarEdgePosition: number, yBarEdgePosition: number) => {

        const xBallPosition: number = xBarEdgePosition + ballXPositionRef.current
        const yBallPosition: number = yBarEdgePosition + ballYPositionRef.current

        clearCanvas(ctx)
        drawBackGround(ctx)
        drawBaseCircle(ctx)
        drawSpiningBar(ctx, xBarEdgePosition, yBarEdgePosition)
        drawBasePole(ctx)
        drawBall(ctx, xBallPosition, yBallPosition)
    }

    const increaseDecreaseHorizontalPosition = () => {
        xPositionRef.current = increaseXPositionRef.current ? xPositionRef.current + increaseStepRef.current : xPositionRef.current - increaseStepRef.current
    }

    const getFlyingBallNextPosition = (realHeight: number) => {
        //Draw ball proyectil movement
        if (realHeight + ballYPositionRef.current < groundYPoint) {
            velocityY.current += GRAVITY_PIXELS
            ballXPositionRef.current += velocityX.current
            ballYPositionRef.current += velocityY.current
        }
    }

    const render = () => {
        if (canvasContext) {

            const { realWidth, realHeight } = getRealCoordinates()

            drawScene(canvasContext, realWidth, realHeight)

            if (!releaseBall) {
                increaseDecreaseHorizontalPosition()
                if (initialAmountSecondsRef.current === 0) {
                    resetValueForNextLaunch()
                }
            }
            else {
                const centerPointBar: Point = { x: realWidth, y: realHeight }
                const centerPointBall: Point = { x: centerXPoint, y: centerYPoint }
                calculateBallParams(centerPointBar, centerPointBall)
                getFlyingBallNextPosition(realHeight)
            }

            setXPositionIncreaseDecreaseDirection()
        }
        animationFrameIdRef.current = window.requestAnimationFrame(render)
    }

    return {
        render
    }
};

export default useCanvas;