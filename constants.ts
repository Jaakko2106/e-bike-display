import { DEFAULT_ROUTE_STEPS } from './types/navigation';

export const SPEED_UNIT = 'km/h';
export const MAX_BATTERY = 100;

export const ROUTE_DIRECTIONS: string[] = DEFAULT_ROUTE_STEPS.map((s) => s.instruction);

export { DEFAULT_ROUTE_STEPS };

export const MUSIC_TRACKS: string[] = ["Riding Rhythms", "Motor Melodies", "Trail Tunes", "E-Boost Bass"];

export const GEAR_LEVELS: string[] = ['OFF', 'ECO', 'TOUR', 'SPORT', 'TURBO'];

// Simulated 48V pack
export const FULL_VOLTAGE = 54.6;
export const EMPTY_VOLTAGE = 42.0;
