export type TurnType = 'straight' | 'left' | 'right' | 'merge' | 'arrive';

export interface RouteStep {
  instruction: string;
  subText?: string;
  turnType: TurnType;
  initialDistanceMeters: number;
}

export const DEFAULT_ROUTE_STEPS: RouteStep[] = [
  {
    instruction: "Continue straight on Main Trail",
    subText: "Follow protected cycle lane",
    turnType: 'straight',
    initialDistanceMeters: 250,
  },
  {
    instruction: "Turn left onto Elm Street",
    subText: "Watch for oncoming bicycle traffic",
    turnType: 'left',
    initialDistanceMeters: 220,
  },
  {
    instruction: "Turn right onto Marina Boulevard",
    subText: "Approaching waterfront junction",
    turnType: 'right',
    initialDistanceMeters: 180,
  },
  {
    instruction: "Merge onto Highway 101 Cycleway",
    subText: "Yield to merging riders",
    turnType: 'merge',
    initialDistanceMeters: 300,
  },
  {
    instruction: "You have arrived at your destination",
    subText: "Destination is on your right",
    turnType: 'arrive',
    initialDistanceMeters: 0,
  },
];
