import './App.css';
import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';
import SolarWatch from './SolarWatch';

interface SunTimes {
  dawn: Date;
  sunrise: Date;
  solarNoon: Date;
  sunset: Date;
  dusk: Date;
}

function App() {
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const times = SunCalc.getTimes(new Date(), latitude, longitude);
        setSunTimes({
          dawn: times.dawn,
          sunrise: times.sunrise,
          solarNoon: times.solarNoon,
          sunset: times.sunset,
          dusk: times.dusk,
        });
      },
      (err) => setError(err.message)
    );
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="App">
      <h1 className="title">wakita</h1>
      {error && <p>{error}</p>}
      {!error && !sunTimes && <p>Obtaining location&hellip;</p>}
      {sunTimes && (
        <>
          <SolarWatch solarNoon={sunTimes.solarNoon} />
          <table className="sun-table" style={{ margin: '0 auto' }}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Time</th>
              </tr>
            </thead>
          <tbody>
            <tr>
              <td>Dawn</td>
              <td>{formatTime(sunTimes.dawn)}</td>
            </tr>
            <tr>
              <td>Sunrise</td>
              <td>{formatTime(sunTimes.sunrise)}</td>
            </tr>
            <tr>
              <td>Solar Noon</td>
              <td>{formatTime(sunTimes.solarNoon)}</td>
            </tr>
            <tr>
              <td>Sunset</td>
              <td>{formatTime(sunTimes.sunset)}</td>
            </tr>
            <tr>
              <td>Dusk</td>
              <td>{formatTime(sunTimes.dusk)}</td>
            </tr>
          </tbody>
        </table>
        </>
      )}
    </div>
  );
}

export default App;
