
import React from 'react';
import { DisplayMetric } from './DisplayMetric';
import { Bike, Clock, TrendingUp, Zap } from './icons';
import { SPEED_UNIT } from '../constants';

interface TripViewProps {
  tripDistance: number;
  odometer: number;
  tripDuration: string;
}

export const TripView: React.FC<TripViewProps> = ({ tripDistance, odometer, tripDuration }) => {
    const durationParts = tripDuration.split(':').map(part => parseFloat(part));
    const totalMinutes = (durationParts[0] * 60 + (durationParts[1] || 0)) / 60;
    const avgSpeed = totalMinutes > 0 ? (tripDistance / totalMinutes * 60).toFixed(1) : '0.0';

    return (
        <div className="grid grid-cols-2 gap-4 h-full p-4">
            <DisplayMetric icon={Bike} label="Trip Distance" value={tripDistance.toFixed(2)} unit="KM" />
            <DisplayMetric icon={TrendingUp} label="Odometer" value={odometer.toFixed(0)} unit="KM" />
            <DisplayMetric icon={Clock} label="Trip Duration" value={tripDuration} unit="" large={true} />
            <DisplayMetric icon={Zap} label="Average Speed" value={avgSpeed} unit={SPEED_UNIT} />
        </div>
    );
};
