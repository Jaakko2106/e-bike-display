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
import { Gauge, Clock, Map, Music, Settings, Video, BatteryPlus, Compass } from './components/icons';
import { globalAudioService } from './services/audioService';
import { DEFAULT_ROUTE_STEPS, RouteStep } from './types/navigation';
import { NavigationToast } from './components/NavigationToast';

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
  const [isCharging, setIsCharging] = useState(false);
  const currentTrack = MUSIC_TRACKS[trackIndex] || 'Riding Rhythms';

  // Navigation steps & distance tracking
  const [directionIndex, setDirectionIndex] = useState(0);
  const currentStep: RouteStep = DEFAULT_ROUTE_STEPS[directionIndex] || DEFAULT_ROUTE_STEPS[0];
  const nextStep: RouteStep | undefined = DEFAULT_ROUTE_STEPS[directionIndex + 1];
  const currentDirection = currentStep.instruction;
  const nextDirection = nextStep?.instruction;
  const [distanceToNextTurn, setDistanceToNextTurn] = useState<number>(DEFAULT_ROUTE_STEPS[0].initialDistanceMeters);
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  const [volume, setVolume] = useState(65);
  const [trackProgress, setTrackProgress] = useState(0);
  const [gpsSignalStrength, setGpsSignalStrength] = useState('Excellent');
  const TRACK_DURATION = 215; // 3:35

  const voltageRange = FULL_VOLTAGE - EMPTY_VOLTAGE;
  const batteryVoltage = EMPTY_VOLTAGE + (batteryPercent / 100) * voltageRange;

  // Keep App.tsx and audio service in sync
  useEffect(() => {
    const unsub = globalAudioService.subscribe((state) => {
      setMusicPlaying(state.isPlaying);
      setTrackIndex(state.trackIndex);
      setVolume(state.volume);
      setTrackProgress(state.currentTime);
      setIsBluetoothConnected(state.isBluetoothConnected);
    });
    return unsub;
  }, []);

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

      // Decrement distance to next turn when navigating and bike is moving
      if (isNavigating && newSpeed > 0) {
        const metersDelta = (newSpeed * 1000 / 3600) * 0.5;
        setDistanceToNextTurn(prev => Math.max(0, prev - metersDelta));
      }

      if (isCharging) {
        setBatteryPercent(prev => Math.min(100, prev + 0.5));
      } else if (newSpeed > 0 && drainRate > 0) {
        setBatteryPercent(prev => Math.max(0, prev - drainRate));
      }

      // Simulate GPS signal fluctuation
      if (Math.random() > 0.95) {
        const levels = ['Excellent', 'Good', 'Fair', 'Poor'];
        setGpsSignalStrength(levels[Math.floor(Math.random() * levels.length)]);
      }

    }, 500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(dataInterval);
    };
  }, [speed, gear, tripStartTime, isCharging, isNavigating]);

  const handleCycleGear = useCallback(() => {
    const currentIndex = GEAR_LEVELS.indexOf(gear);
    const newIndex = (currentIndex + 1) % GEAR_LEVELS.length;
    const newGear = GEAR_LEVELS[newIndex];
    setGear(newGear);

    if (newGear !== 'OFF' && tripStartTime === null) {
        setTripStartTime(Date.now());
    }
  }, [gear, tripStartTime]);

  const handleNextTrack = () => {
    globalAudioService.next();
  };
  
  const handlePrevTrack = () => {
    globalAudioService.prev();
  };

  const handleCycleDirection = useCallback(() => {
    if (directionIndex < DEFAULT_ROUTE_STEPS.length - 1) {
      const nextIdx = directionIndex + 1;
      setDirectionIndex(nextIdx);
      setDistanceToNextTurn(DEFAULT_ROUTE_STEPS[nextIdx].initialDistanceMeters);
      setIsToastDismissed(false);
    } else {
      handleEndRoute();
    }
  }, [directionIndex]);

  const handleStartRoute = () => {
    if (destination.trim()) {
      setIsNavigating(true);
      setDirectionIndex(0);
      setDistanceToNextTurn(DEFAULT_ROUTE_STEPS[0].initialDistanceMeters);
      setIsToastDismissed(false);
    }
  };

  const handleEndRoute = () => {
    setIsNavigating(false);
    setDestination('');
    setDirectionIndex(0);
    setDistanceToNextTurn(DEFAULT_ROUTE_STEPS[0].initialDistanceMeters);
    setIsToastDismissed(false);
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
    const nextState = !isBluetoothConnected;
    setIsBluetoothConnected(nextState);
    globalAudioService.setBluetoothConnected(nextState);
  };

  const getGpsColor = () => {
    switch (gpsSignalStrength) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-500';
      default: return 'text-gray-200';
    }
  };

  const getBatteryHealthColor = () => {
    if (batteryLifespan >= 90) return 'text-green-400';
    if (batteryLifespan >= 80) return 'text-blue-400';
    if (batteryLifespan >= 60) return 'text-yellow-400';
    return 'text-red-500';
  };

  const renderContent = () => {
    switch (displayMode) {
      case DisplayMode.DASHBOARD:
        return <DashboardView speed={speed} gear={gear} batteryPercent={batteryPercent} batteryVoltage={batteryVoltage} isCharging={isCharging} />;
      case DisplayMode.TRIP:
        return <TripView tripDistance={tripDistance} odometer={odometer} tripDuration={tripDuration} />;
      case DisplayMode.MAP:
        return isNavigating ? (
          <MapNavigation 
            currentDirection={currentDirection} 
            nextDirection={nextDirection} 
            cycleDirection={handleCycleDirection} 
            endRoute={handleEndRoute} 
            destination={destination}
            distanceToNextTurn={distanceToNextTurn}
            setDistanceToNextTurn={(d) => {
              setDistanceToNextTurn(d);
              setIsToastDismissed(false);
            }}
            currentStep={currentStep}
            nextStep={nextStep}
          />
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
          volume={volume}
          setVolume={setVolume}
          trackProgress={trackProgress}
          trackDuration={TRACK_DURATION}
        />;
      case DisplayMode.CAMERA:
        return <CameraView handleCameraToggle={handleCameraToggle} onNavigateToSettings={() => setDisplayMode(DisplayMode.SETTINGS)} />;
      case DisplayMode.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-white">
            <Settings className="w-12 h-12 text-indigo-400 mb-4" />
            <h2 className="text-3xl font-bold">Settings</h2>
            <p className="text-gray-400 mt-2">Unit: {SPEED_UNIT.toUpperCase()} | GPS: ON</p>
            
            <div className="mt-8 w-full max-w-xs bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-center mb-3">
                <BatteryPlus className={`w-6 h-6 mr-2 ${getBatteryHealthColor()}`} />
                <h3 className="text-lg font-semibold text-white">Battery Health</h3>
              </div>
              <div className="flex justify-around text-center">
                <div>
                  <div className="font-bold text-2xl text-gray-200 font-mono">{batteryCycleCount}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Cycles</div>
                </div>
                <div>
                  <div className={`font-bold text-2xl font-mono ${getBatteryHealthColor()}`}>{batteryLifespan}%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Lifespan</div>
                </div>
              </div>
            </div>

            <div className="mt-4 w-full max-w-xs bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-center mb-2">
                    <Compass className="w-6 h-6 text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">GPS Signal</h3>
                </div>
                <div className={`font-bold text-2xl font-mono ${getGpsColor()}`}>{gpsSignalStrength}</div>
            </div>

            <button
                onClick={() => setIsCharging(prev => !prev)}
                className={`mt-6 w-full max-w-xs p-3 sm:p-4 font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-base sm:text-lg ${isCharging ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            >
                {isCharging ? 'UNPLUG CHARGER' : 'PLUG IN CHARGER'}
            </button>

            <button
                onClick={handleStopAndReset}
                className="mt-4 w-full max-w-xs p-3 sm:p-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl active:scale-[0.98] shadow-lg transition duration-150 touch-action-manipulation text-base sm:text-lg"
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
          {/* Navigation Toast Notification when within 100 meters of an intersection */}
          {isNavigating && distanceToNextTurn <= 100 && !isToastDismissed && currentStep.turnType !== 'arrive' && (
            <div className="absolute top-2.5 sm:top-4 left-0 right-0 z-50 pointer-events-none px-2 sm:px-4">
              <NavigationToast
                distanceMeters={distanceToNextTurn}
                instruction={currentStep.instruction}
                turnType={currentStep.turnType}
                subText={currentStep.subText}
                onDismiss={() => setIsToastDismissed(true)}
                onTurnAction={handleCycleDirection}
              />
            </div>
          )}

          {renderContent()}
          {displayMode !== DisplayMode.SETTINGS && displayMode !== DisplayMode.CAMERA && (
            <button
              onClick={handleCameraToggle}
              className="absolute bottom-4 right-4 p-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-full shadow-2xl transition duration-150 active:scale-95 touch-action-manipulation z-40 sm:p-5"
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