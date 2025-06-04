import React from 'react';

interface Props {
  dawn: Date;
  sunrise: Date;
  solarNoon: Date;
  sunset: Date;
  dusk: Date;
}

const SunTimesTable = ({ dawn, sunrise, solarNoon, sunset, dusk }: Props) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <table className="sun-table" style={{ margin: '0 auto', marginBottom: '20px' }}>
      <thead>
        <tr>
          <th>Dawn</th>
          <th>Sunrise</th>
          <th>Solar Noon</th>
          <th>Sunset</th>
          <th>Dusk</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{formatTime(dawn)}</td>
          <td>{formatTime(sunrise)}</td>
          <td>{formatTime(solarNoon)}</td>
          <td>{formatTime(sunset)}</td>
          <td>{formatTime(dusk)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SunTimesTable;
