import { createSlice } from "@reduxjs/toolkit";

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 600;

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_OFFSET_X = 20;
const PADDLE_OFFSET_Y = 50;
const PADDLE_SPEED = 20;

const humanPaddle = {
  controller: "human",
  position: "left",
  x: PADDLE_OFFSET_X,
  y: PADDLE_OFFSET_Y,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  score: 0,
};

const computerPaddle = {
  controller: "computer",
  position: "right",
  x: GAME_WIDTH - PADDLE_OFFSET_X - PADDLE_WIDTH,
  y: PADDLE_OFFSET_Y,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  score: 0,
};

const resumeButton = {
  x: GAME_WIDTH / 2,
  y: GAME_HEIGHT / 2 - 50,
  top_x: GAME_WIDTH / 2 - 120,
  top_y: GAME_HEIGHT / 2 - 100,
  text: "RESUME",
};

const randomDirection = () => {
    let direction = Math.random();
    if (direction > 0.5) {
      return -1 * direction;
    } else {
      return direction;
    }
  };
  

const startButton = Object.assign({}, resumeButton, {
  text: "Filloni Lojen",
});

const restartButton = Object.assign({}, resumeButton, {
  text: "Luaj Perseri",
});

const BALL_DEFAULTS = {
  x: GAME_WIDTH / 2,
  y: GAME_HEIGHT / 2,
  radius: 10,
  x_speed: 5,
  y_speed: 5,
};

const initialState = {
  config: {
    boardColor: 0x0d0c22,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  velocity: PADDLE_SPEED,
  players: {
    left: humanPaddle,
    right: computerPaddle,
  },
  ball: BALL_DEFAULTS,
  buttons: {
    restart: restartButton,
    start: startButton,
    resume: resumeButton,
  },
  keysPressed: {},
  status: "pre-start",
  winner: null,
  winningScore: 5,
};

export const pongSlice = createSlice({
    name: "pong",
    initialState,
    reducers: {
      startGame: (state) => {
        state.status = "playing";
      },
      pauseGame: (state) => {
        state.status = "paused";
      },
      resumeGame: (state) => {
        state.status = "playing";
      },
      endGame: (state) => {
        state.status = "game-over";
      },
      restartGame: (state) => {
        state.status = "playing";
        state.players = initialState.players;
        state.winner = null;
      },
      keyPress: (state, action) => {
        state.keysPressed[action.payload] = true;
      },
      keyUp: (state, action) => {
        state.keysPressed[action.payload] = true;
      },
      movePaddleUp: (state, action) => {
        if (state.status === "paused") return state;
  
        const position = action.payload;
        const player = state.players[position];
        player.y -= state.velocity;
        if (player.y < 0) {
          player.y = 0;
        }
      },
      movePaddleDown: (state, action) => {
        if (state.status === "paused") return state;
  
        const position = action.payload;
        const player = state.players[position];
        player.y += state.velocity;
        if (player.y + PADDLE_HEIGHT > GAME_HEIGHT) {
          player.y = GAME_HEIGHT - PADDLE_HEIGHT;
        }
      },
      moveBall: (state) => {
        const top_y = state.ball.y - state.ball.radius;
        const right_x = state.ball.x + state.ball.radius;
        const bottom_y = state.ball.y + state.ball.radius;
        const left_x = state.ball.x - state.ball.radius;
  
        const paddle1 = state.players.left;
        const paddle2 = state.players.right;
  
        state.ball.x += state.ball.x_speed;
        state.ball.y += state.ball.y_speed;
  
        if (state.ball.y - state.ball.radius < 0) {
          state.ball.y = state.ball.radius;
          state.ball.y_speed = -state.ball.y_speed;
        }
        else if (state.ball.y + state.ball.radius > state.config.height) {
          state.ball.y = state.config.height - state.ball.radius;
          state.ball.y_speed = -state.ball.y_speed;
        }
  
        if (state.ball.x < 0) {
          state.ball.x_speed = 5;
          state.ball.y_speed = 3 * randomDirection();
          state.ball.x = BALL_DEFAULTS.x;
          state.ball.y = BALL_DEFAULTS.y;
  
          paddle2.score += 1;
  
          if (paddle2.score === state.winningScore) {
            state.winner = paddle2;
          }
        }
        else if (state.ball.x > state.config.width) {
          state.ball.x_speed = -5;
          state.ball.y_speed = 3 * randomDirection();
          state.ball.x = BALL_DEFAULTS.x;
          state.ball.y = BALL_DEFAULTS.y;
  
          paddle1.score += 1;
  
          if (paddle1.score === state.winningScore) {
            state.winner = paddle1;
          }
        }
  
        if (right_x < state.config.width / 2) {
          if (
              right_x > paddle1.x &&
              left_x < paddle1.x + paddle1.width &&
              top_y < paddle1.y + paddle1.height &&
              bottom_y > paddle1.y
            ) {
              state.ball.x_speed = Math.abs(state.ball.x_speed) + Math.random();
              state.ball.y_speed += Math.random();
              state.ball.x += state.ball.x_speed;
            }
          } else {
            if (
              right_x > paddle2.x &&
              left_x < paddle2.x + paddle2.width &&
              top_y < paddle2.y + paddle2.height &&
              bottom_y > paddle2.y
            ) {
              state.ball.x_speed = -Math.abs(state.ball.x_speed) - Math.random();
              state.ball.y_speed += Math.random();
              state.ball.x += state.ball.x_speed;
            }
          }
        },
      },
    });

    export const {
        startGame,
        pauseGame,
        resumeGame,
        endGame,
        restartGame,
        keyPress,
        keyUp,
        movePaddleUp,
        movePaddleDown,
        moveBall,
      } = pongSlice.actions;
      
      export default pongSlice.reducer;

      export const selectWinner = (state) => state.pong.winner;
  
  export const selectStatus = (state) => state.pong.status;
  
  export const selectPlayers = (state) => state.pong.players;
  
  export const selectConfig = (state) => state.pong.config;
  
  export const selectButtons = (state) => state.pong.buttons;
  
  export const selectBall = (state) => state.pong.ball;
  