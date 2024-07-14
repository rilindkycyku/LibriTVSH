import React from 'react';
import { Graphics } from '@inlet/react-pixi';

export default function Ball(props) {
  const {
    data: { x, y, radius },
  } = props;

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(0xffffff);
        g.drawCircle(x, y, radius);
        g.endFill();
      }}
    />
  );
}
