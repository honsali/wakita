import { useEffect, useState } from 'react';

interface Props {
  solarNoon: Date;
}

const RADIUS = 80;
const STROKE = 10;
const CIRC = 2 * Math.PI * RADIUS;

function SolarWatch({ solarNoon }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const noonMinutes =
    solarNoon.getHours() * 60 +
    solarNoon.getMinutes() +
    solarNoon.getSeconds() / 60;
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  // 12:00 should match solar noon
  const offset = 720 - noonMinutes; // minutes to add to local time
  const solarMinutes = (nowMinutes + offset + 1440) % 1440; // wrap around 24h

  const ratio = solarMinutes / 720; // position on 12-hour dial
  const angle = ratio * 360;
  const dashOffset = CIRC * (1 - ratio);

  return (
    <svg width={(RADIUS + STROKE) * 2} height={(RADIUS + STROKE) * 2}>
      <g transform={`translate(${RADIUS + STROKE}, ${RADIUS + STROKE})`}>
        <circle
          r={RADIUS}
          fill="none"
          stroke="#eee"
          strokeWidth={STROKE}
        />
        <circle
          r={RADIUS}
          fill="none"
          stroke="#00f"
          strokeWidth={STROKE}
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform="rotate(-90)"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={-RADIUS + STROKE}
          stroke="#f00"
          strokeWidth="2"
          transform={`rotate(${angle})`}
        />
      </g>
    </svg>
  );
}

export default SolarWatch;
