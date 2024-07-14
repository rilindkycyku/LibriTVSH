import React from 'react';
import { Graphics } from '@inlet/react-pixi';

function Paddle(props) {
  const {
    player: { x, y, position, width, height },
  } = props;

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        if (position === 'left') g.beginFill(0xf977a3);
        if (position === 'right') g.beginFill(0x66ddd4);
        const cornerRadius = 10;
        g.drawRoundedRect(x, y, width, height, cornerRadius);
        g.endFill();
      }}
    />
  );
}

export default Paddle;
