import { useEffect, useState } from 'react';

interface Props {
  dawn: Date;
  sunrise: Date;
  solarNoon: Date;
  sunset: Date;
  dusk: Date;
}

const RADIUS = 80;
const STROKE = 20;
const CIRC = 2 * Math.PI * RADIUS;
const LABEL_RADIUS = RADIUS + STROKE + 12;

function SolarWatch({ dawn, sunrise, solarNoon, sunset, dusk }: Props) {
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

  const angleFor = (date: Date) => {
    const m = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
    const sm = (m + offset + 1440) % 1440;
    return (sm / 720) * 360;
  };

  const dawnAngle = angleFor(dawn);
  const sunriseAngle = angleFor(sunrise);
  const noonAngle = angleFor(solarNoon);
  const sunsetAngle = angleFor(sunset);
  const duskAngle = angleFor(dusk);

  const ratio = solarMinutes / 720; // position on 12-hour dial
  const angle = ratio * 360;
  const dashOffset = CIRC * (1 - ratio);

  return (
    <svg width={(RADIUS + STROKE) * 2} height={(RADIUS + STROKE) * 2}>
      <defs>
        <linearGradient id="skyGradient" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="pink" />
          <stop offset="25%" stopColor="lightblue" />
          <stop offset="50%" stopColor="orange" />
          <stop offset="75%" stopColor="darkblue" />
          <stop offset="100%" stopColor="pink" />
        </linearGradient>
      </defs>
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
          stroke="url(#skyGradient)"
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
        {[
          { label: 'Dawn', angle: dawnAngle },
          { label: 'Sunrise', angle: sunriseAngle },
          { label: 'Noon', angle: noonAngle },
          { label: 'Sunset', angle: sunsetAngle },
          { label: 'Dusk', angle: duskAngle },
        ].map(({ label, angle: a }) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const x = LABEL_RADIUS * Math.cos(rad);
          const y = LABEL_RADIUS * Math.sin(rad);
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: '10px' }}
            >
              {label}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export default SolarWatch;
