import './App.css';
import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';
import SolarWatch from './SolarWatch';
import SunTimesTable from './SunTimesTable';

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

  return (
    <div className="App">
      <h1 className="title">wakita</h1>
      {error && <p>{error}</p>}
      {!error && !sunTimes && <p>Obtaining location&hellip;</p>}
      {sunTimes && (
        <>
          <SunTimesTable
            dawn={sunTimes.dawn}
            sunrise={sunTimes.sunrise}
            solarNoon={sunTimes.solarNoon}
            sunset={sunTimes.sunset}
            dusk={sunTimes.dusk}
          />
          <SolarWatch
            dawn={sunTimes.dawn}
            sunrise={sunTimes.sunrise}
            solarNoon={sunTimes.solarNoon}
            sunset={sunTimes.sunset}
            dusk={sunTimes.dusk}
          />
        </>
      )}
    </div>
  );
}

export default App;
