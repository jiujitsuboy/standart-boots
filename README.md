# Ball Lancher project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Architecture

This project consist in a simple SPA, constituted by:

1. **Main page:** Responsable to gather all application components.

2. **Canvas component:** Responsable for rendering the canvas where the animation it is going to be painted.

3. **useCanvas:** React Hook, where all the drawing and calculation logic is stored

4. **DomainContext:** React Context to share certain data and method though out the application components.

![image](screenshots/application.png)

## How to use it

The application consist in two main sections:

1. Canvas for drawing the spinning arm and lanching the ball.

![image](screenshots/canvas.png)

2. An action button that release the ball and reset the arm to start over again.

![image](screenshots/actionButton.png)

3. Engine specifications section, for specifing the torque, max speed and seconds to reach top speed of the tested engine.

![image](screenshots/engineSpecifications.png)

4. Results section, where the Range of the through, angule and height are displayed.

![image](screenshots/CalculationResults.png)


 As soon as the web page load, it start spinning the arm by accelerating from 0 toward the top speed configured for the specific engine.

 When ever you hit the Launch button, the ball will be loose and the calculations are done.

 ![image](screenshots/BallLaunched.png)

 To start spinning the arm again, it is just a matter to hit again the button (now labeled Reset).

 ![image](screenshots/BallSpinning.png)

 When ever you start the engine (by clicking the Reset button), the parameters that are on the Engine specifications section will be pick up.

By default the engine specifications are:

**Torque:** 20 Nm
**Top Speed:** 20 km/h
**Second to Top Speed:** 10 seconds

## Physics Formulas

For calculating the projectil motion I used the following formulas:

* *For calculating speed:*

      Vx = V.cos(angule)

      Vy = V.sin(angule)

* *Range of the projectile*

                             _________________________
                           \/  (Vo.sin(angule)^2 + 2gh
      R = Vo.cos(angule).  ---------------------------
                                       g

Vo = Initial Velocity.
angule = angule of release plus 90 degrees (because the ball is released not up but to the side, so 90 degrees added to the angule build between the arm and the x-axis)
g = gravity constant (9.2 km/s^2)
h = hight of release.

### Material Weight

For calculating the weight of the arm bar I used this webpage https://www.omnicalculator.com/construction/aluminum-weight

For calculating the weight of the ball. I used this webpage https://www.onlinemetals.com/en/weight-calculator

## Video demostration

https://github.com/standardbots-candidate/take-home-jose-mora/assets/23085263/e3d338c2-8931-4fc0-a2cf-9d449f04dcdd
