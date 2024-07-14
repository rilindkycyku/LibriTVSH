
import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import { Container, Text, useApp, useTick } from "@inlet/react-pixi";

import Ball from "./Ball";
import Button from "./Button";
import Paddle from "./Paddle";

import {
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  restartGame,
  keyUp,
  movePaddleUp,
  movePaddleDown,
  moveBall,
} from "./pongSlice";

export default function Pong(props) {
  const app = useApp();

  const { winner, players, status, config, buttons, ball, dispatch } = props;

  const tick = () => {
    if (!winner) {
      dispatch(moveBall());
    }
  };

  const onKeyUp = (event) => {
    dispatch(keyUp(event.key));
  };

  const onKeyDown = (event) => {
    event.preventDefault();
    switch (event.code) {
      case "Escape":
        dispatch(pauseGame());
        app.ticker.remove(tick);
        break;

      case "KeyW":
        dispatch(movePaddleUp("left"));
        break;
      case "KeyS": 
        dispatch(movePaddleDown("left"));
        break;
      case "ArrowUp":
        dispatch(movePaddleUp("right"));
        break;
      case "ArrowDown":
        dispatch(movePaddleDown("right"));
        break;
      default:
        console.log("Key", event);
        return; 
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (app && app.ticker) { 
        app.ticker.remove(tick);
    }
    };
  });

  const cResumeGame = () => {
    app.ticker.add(tick);
    dispatch(resumeGame());
  };

  const cRestartGame = () => {
    app.ticker.add(tick);
    dispatch(restartGame());
  };

  useTick((delta) => {
    if (!winner && status === "playing") {
      dispatch(moveBall());
    } else if (winner) {
      dispatch(endGame());
      app.ticker.remove(tick);
    }
  });

  const start = () => {
    dispatch(startGame());
    app.ticker.add(tick);
  };

  return (
    <Container>
      <Text
        text={players.left.score.toString()}
        anchor={0.5}
        x={config.width / 4}
        y={150}
        style={
          new PIXI.TextStyle({
            fontSize: 60,
            fill: "#ffffff",
            letterSpacing: 10,
          })
        }
      />
      <Text
        text={players.right.score.toString()}
        anchor={0.5}
        x={(config.width / 4) * 3}
        y={150}
        style={
          new PIXI.TextStyle({
            fontSize: 60,
            fill: "#ffffff",
            letterSpacing: 10,
          })
        }
      />
      <Paddle player={players.left} />
      <Paddle player={players.right} />
      {status === "pre-start" && (
        <>
          <Text
            text="Luaj PINGPONG!"
            anchor={0.5}
            x={config.width / 2}
            y={50}
            isSprite
            style={
              new PIXI.TextStyle({
                align: "center",
                fontFamily: "Futura, sans-serif",
                fontSize: 40,
                fill: "#ffffff",
                letterSpacing: 10,
              })
            }
          />
          <Button data={buttons.start} action={() => start()} />
        </>
      )}
      {status === "paused" && (
        <>
          <Button data={buttons.resume} action={cResumeGame} />
          <Ball data={ball} />
        </>
      )}
      {status === "playing" && <Ball data={ball} />}
      {status === "game-over" && (
        <>
          <Text
            text={
              winner
                ? winner.position === "left"
                  ? "Urime! Fitoj Lojtari me numer 1"
                  : "Urime! Fitoj Lojtari me numer 2"
                : ""
            }
            anchor={0.5}
            x={config.width / 2}
            y={50}
            isSprite
            style={
              new PIXI.TextStyle({
                align: "center",
                fontFamily: "Futura, sans-serif",
                fontSize: 40,
                fill: "#ffffff",
                letterSpacing: 10,
              })
            }
          />
          <Button data={buttons.restart} action={() => cRestartGame()} />
        </>
      )}
    </Container>
  );
}