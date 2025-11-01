import React, { useState, useEffect, useCallback } from 'react';
import { DisplayMode } from './types';
import { EMPTY_VOLTAGE, FULL_VOLTAGE, GEAR_LEVELS, MUSIC_TRACKS, ROUTE_DIRECTIONS, SPEED_UNIT } from './constants';
import { CameraView } from './components/CameraView';
import { DashboardView } from './components/DashboardView';
import { GearControl } from './components/GearControl';
import { MapInputView } from './components/MapInputView';
import { MapNavigation } from './components/MapNavigation';
import { MusicView } from './components/MusicView';
import { TripView } from './components/TripView';
import { NavButton } from './components/NavButton';
import { Gauge, Clock, Map, Music, Settings, Video, BatteryPlus } from './components/icons';

const App: React.FC = () => {
  const [speed, setSpeed] = useState(0.0);
  const [gear, setGear] = useState('OFF');
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [tripDistance, setTripDistance] = useState(0.0);
  const [odometer, setOdometer] = useState(1245.7);
  const [tripStartTime, setTripStartTime] = useState<number | null>(null);
  const [tripDuration, setTripDuration] = useState('00:00');
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.DASHBOARD);
  const [destination, setDestination] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(true);
  const [batteryCycleCount, setBatteryCycleCount] = useState(158);
  const [batteryLifespan, setBatteryLifespan] = useState(92);
  const currentTrack = MUSIC_TRACKS[trackIndex];
  const [directionIndex, setDirectionIndex] = useState(0);
  const currentDirection = ROUTE_DIRECTIONS[directionIndex];
  const nextDirection = ROUTE_DIRECTIONS[directionIndex + 1];

  const voltageRange = FULL_VOLTAGE - EMPTY_VOLTAGE;
  const batteryVoltage = EMPTY_VOLTAGE + (batteryPercent / 100) * voltageRange;

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (speed > 0 && tripStartTime) {
        const elapsed = Date.now() - tripStartTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        setTripDuration(`${minutes}:${seconds}`);
      }
    }, 1000);

    const dataInterval = setInterval(() => {
      let newSpeed = speed;
      let drainRate = 0;
      let acceleration = 0.5;

      switch (gear) {
        case 'ECO': acceleration = 1.0; drainRate = 0.005; break;
        case 'TOUR': acceleration = 2.0; drainRate = 0.01; break;
        case 'SPORT': acceleration = 3.5; drainRate = 0.02; break;
        case 'TURBO': acceleration = 5.0; drainRate = 0.04; break;
        case 'OFF': default: acceleration = 0; drainRate = 0; break;
      }

      newSpeed = gear !== 'OFF' ? Math.min(newSpeed + (acceleration * 0.1), 35) : Math.max(newSpeed - 1.0, 0);
      newSpeed = Math.max(0, newSpeed);
      setSpeed(newSpeed);

      const distanceDelta = (newSpeed / 3600) * 0.5; // distance for 0.5s interval
      if(newSpeed > 0) {
        setTripDistance(prev => prev + distanceDelta);
        setOdometer(prev => prev + distanceDelta);
      }

      if (newSpeed > 0 && drainRate > 0) {
        setBatteryPercent(prev => Math.max(0, prev - drainRate));
      }

    }, 500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(dataInterval);
    };
  }, [speed, gear, tripStartTime]);

  const handleCycleGear = useCallback(() => {
    const currentIndex = GEAR_LEVELS.indexOf(gear);
    const newIndex = (currentIndex + 1) % GEAR_LEVELS.length;
    const newGear = GEAR_LEVELS[newIndex];
    setGear(newGear);

    if (newGear !== 'OFF' && tripStartTime === null) {
        setTripStartTime(Date.now());
    }
  }, [gear, tripStartTime]);

  const handleNextTrack = () => setTrackIndex(prev => (prev + 1) % MUSIC_TRACKS.length);
  const handlePrevTrack = () => setTrackIndex(prev => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);

  const handleCycleDirection = () => {
    if (directionIndex < ROUTE_DIRECTIONS.length - 1) {
      setDirectionIndex(prev => prev + 1);
    } else {
      handleEndRoute();
    }
  };

  const handleStartRoute = () => {
    if (destination.trim()) {
      setIsNavigating(true);
      setDirectionIndex(0);
    }
  };

  const handleEndRoute = () => {
    setIsNavigating(false);
    setDestination('');
    setDirectionIndex(0);
  };

  const handleCameraToggle = () => {
      setDisplayMode(prevMode => (prevMode === DisplayMode.CAMERA ? DisplayMode.DASHBOARD : DisplayMode.CAMERA));
  };
  
  const handleStopAndReset = () => {
      setSpeed(0);
      setGear('OFF');
      setTripDistance(0.0);
      setTripStartTime(null);
      setTripDuration('00:00');
  }

  const handleToggleBluetooth = () => {
    setIsBluetoothConnected(prev => !prev);
  };

  const renderContent = () => {
    switch (displayMode) {
      case DisplayMode.DASHBOARD:
        return <DashboardView speed={speed} gear={gear} batteryPercent={batteryPercent} batteryVoltage={batteryVoltage} />;
      case DisplayMode.TRIP:
        return <TripView tripDistance={tripDistance} odometer={odometer} tripDuration={tripDuration} />;
      case DisplayMode.MAP:
        return isNavigating ? (
          <MapNavigation currentDirection={currentDirection} nextDirection={nextDirection} cycleDirection={handleCycleDirection} endRoute={handleEndRoute} destination={destination} />
        ) : (
          <MapInputView destination={destination} setDestination={setDestination} startRoute={handleStartRoute} />
        );
      case DisplayMode.MUSIC:
        return <MusicView 
          isPlaying={musicPlaying} 
          setIsPlaying={setMusicPlaying} 
          currentTrack={currentTrack} 
          nextTrack={handleNextTrack} 
          prevTrack={handlePrevTrack} 
          isBluetoothConnected={isBluetoothConnected}
          toggleBluetooth={handleToggleBluetooth}
        />;
      case DisplayMode.CAMERA:
        return <CameraView handleCameraToggle={handleCameraToggle} />;
      case DisplayMode.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-white">
            <Settings className="w-12 h-12 text-indigo-400 mb-4" />
            <h2 className="text-3xl font-bold">Settings</h2>
            <p className="text-gray-400 mt-2">Unit: {SPEED_UNIT.toUpperCase()} | GPS: ON</p>
            
            <div className="mt-8 w-full max-w-xs bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-center mb-3">
                <BatteryPlus className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Battery Health</h3>
              </div>
              <div className="flex justify-around text-center">
                <div>
                  <div className="font-bold text-2xl text-gray-200 font-mono">{batteryCycleCount}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Cycles</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-gray-200 font-mono">{batteryLifespan}%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Lifespan</div>
                </div>
              </div>
            </div>

            <button
                onClick={handleStopAndReset}
                className="mt-6 p-3 sm:p-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-base sm:text-lg"
            >
                STOP SIMULATION / RESET TRIP
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-2 sm:p-4">
      <div className="flex-grow bg-gray-950 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-800 flex flex-col max-w-xl sm:max-w-3xl mx-auto w-full h-full lg:h-[80vh] lg:max-h-[900px]">
        <header className="flex justify-between items-center p-3 sm:p-4 bg-gray-800/80 border-b border-gray-700">
          <div className="text-sm sm:text-base font-semibold text-white">E-Bike OS v1.2</div>
          <div className="flex items-center space-x-2">
            <div className="text-lg sm:text-xl font-mono text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </header>

        <main className="flex-grow min-h-0 relative">
          {renderContent()}
          {displayMode !== DisplayMode.SETTINGS && displayMode !== DisplayMode.CAMERA && (
            <button
              onClick={handleCameraToggle}
              className="absolute bottom-4 right-4 p-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-full shadow-2xl transition duration-150 active:scale-95 touch-action-manipulation z-50 sm:p-5"
              aria-label="Activate Rear Camera"
            >
              <Video className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}
        </main>

        <div className="p-3 sm:p-4 bg-gray-800/80 border-t border-gray-700">
          <div className="mb-3">
              <GearControl gear={gear} onCycle={handleCycleGear} />
          </div>

          <nav className="flex justify-around items-center">
            <NavButton mode={DisplayMode.DASHBOARD} currentMode={displayMode} onClick={setDisplayMode} icon={Gauge} label="Dash" />
            <NavButton mode={DisplayMode.TRIP} currentMode={displayMode} onClick={setDisplayMode} icon={Clock} label="Trip" />
            <NavButton mode={DisplayMode.MAP} currentMode={displayMode} onClick={setDisplayMode} icon={Map} label="Nav" />
            <NavButton mode={DisplayMode.MUSIC} currentMode={displayMode} onClick={setDisplayMode} icon={Music} label="Music" />
            <NavButton mode={DisplayMode.SETTINGS} currentMode={displayMode} onClick={setDisplayMode} icon={Settings} label="Setup" />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default App;