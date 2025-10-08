import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../App';
import { Clock, Star } from 'lucide-react';

const segments = [
    { label: '50', value: 50, color: 'bg-blue-500' },
    { label: 'Try Again', value: 0, color: 'bg-gray-500' },
    { label: '100', value: 100, color: 'bg-green-500' },
    { label: '20', value: 20, color: 'bg-yellow-500' },
    { label: '200', value: 200, color: 'bg-purple-500' },
    { label: 'Try Again', value: 0, color: 'bg-gray-500' },
    { label: '75', value: 75, color: 'bg-indigo-500' },
    { label: '10', value: 10, color: 'bg-pink-500' },
];

const LAST_SPIN_TIMESTAMP_KEY = 'lastSpinTimestamp';
const SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const SpinWheel: React.FC = () => {
    const { updateUserPoints } = useAuth();
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [canSpin, setCanSpin] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [spinResult, setSpinResult] = useState<{ value: number; label: string } | null>(null);

    useEffect(() => {
        const lastSpinTime = localStorage.getItem(LAST_SPIN_TIMESTAMP_KEY);
        
        const checkCooldown = () => {
            const now = Date.now();
            if (lastSpinTime) {
                const timeSinceLastSpin = now - parseInt(lastSpinTime, 10);
                if (timeSinceLastSpin < SPIN_COOLDOWN_MS) {
                    setCanSpin(false);
                    const remainingTime = SPIN_COOLDOWN_MS - timeSinceLastSpin;
                    updateTimer(remainingTime);
                    return remainingTime;
                }
            }
            setCanSpin(true);
            setTimeLeft('');
            return 0;
        };

        const remaining = checkCooldown();
        
        const interval = setInterval(() => {
           const newRemaining = checkCooldown();
            if (newRemaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateTimer = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };

    const handleSpin = () => {
        if (!canSpin || isSpinning) return;

        setIsSpinning(true);
        setSpinResult(null);

        const winningSegmentIndex = Math.floor(Math.random() * segments.length);
        const segmentAngle = 360 / segments.length;
        
        // Calculate the angle to the middle of the winning segment.
        const winningSegmentMiddleAngle = (winningSegmentIndex * segmentAngle) + (segmentAngle / 2);
        // The wheel needs to rotate so that the winning segment's middle angle is at the top (0 degrees).
        // A positive rotation is clockwise. To bring a point at angle `A` to the top, we need to rotate by `-A`.
        // We calculate the final position within a 360-degree circle.
        const targetAngle = 360 - winningSegmentMiddleAngle;

        const fullRotations = 360 * 8; // More rotations for a longer spin
        const finalRotation = fullRotations + targetAngle;
        
        setRotation(prev => prev - (prev % 360) + finalRotation);

        setTimeout(() => {
            const winningSegment = segments[winningSegmentIndex];
            setIsSpinning(false);
            setSpinResult(winningSegment);
            if(winningSegment.value > 0) {
                updateUserPoints(winningSegment.value);
            }
            localStorage.setItem(LAST_SPIN_TIMESTAMP_KEY, Date.now().toString());
            setCanSpin(false);
            updateTimer(SPIN_COOLDOWN_MS);

             const interval = setInterval(() => {
                const now = Date.now();
                const lastSpinTime = parseInt(localStorage.getItem(LAST_SPIN_TIMESTAMP_KEY) || '0', 10);
                const timeSinceLastSpin = now - lastSpinTime;
                 if (timeSinceLastSpin >= SPIN_COOLDOWN_MS) {
                    setCanSpin(true);
                    setTimeLeft('');
                    clearInterval(interval);
                } else {
                    updateTimer(SPIN_COOLDOWN_MS - timeSinceLastSpin);
                }
            }, 1000);

        }, 7000); // Corresponds to animation duration
    };
    
    const conicGradient = useMemo(() => {
         const segmentAngle = 360 / segments.length;
         const gradientParts = segments.map((seg, i) => {
             const startAngle = i * segmentAngle;
             const endAngle = (i + 1) * segmentAngle;
             // We need to resolve tailwind colors to hex/rgb for the gradient
             const colorMap: { [key: string]: string } = {
                 'bg-blue-500': '#3b82f6', 'bg-gray-500': '#6b7280', 'bg-green-500': '#22c55e',
                 'bg-yellow-500': '#eab308', 'bg-purple-500': '#a855f7', 'bg-indigo-500': '#6366f1',
                 'bg-pink-500': '#ec4899'
             };
             return `${colorMap[seg.color]} ${startAngle}deg ${endAngle}deg`;
         });
         return `conic-gradient(${gradientParts.join(', ')})`;
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Bonus Spin</h1>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="relative flex items-center justify-center w-80 h-80 md:w-96 md:h-96">
                    <div 
                        className="absolute w-full h-full rounded-full border-8 border-gray-300 dark:border-gray-600 shadow-lg"
                        style={{ 
                            background: conicGradient,
                            transition: 'transform 7s cubic-bezier(0.215, 0.61, 0.355, 1)',
                            transform: `rotate(${rotation}deg)`
                        }}
                    >
                         {segments.map((segment, index) => {
                            const angle = (360 / segments.length) * (index + 0.5);
                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{ transform: `rotate(${angle}deg)` }}
                                >
                                    <div className="absolute flex items-center justify-center w-1/2 h-12 text-white font-bold text-lg -translate-y-1/2 top-1/2 left-1/2 origin-left">
                                        <span>{segment.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="absolute w-8 h-8 bg-white border-4 border-gray-300 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 dark:bg-gray-700 dark:border-gray-500"></div>
                     <div 
                        className="absolute text-primary-500 top-0 left-1/2 -translate-x-1/2 -translate-y-full"
                        style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                            width: '30px',
                            height: '40px',
                            backgroundColor: 'currentColor'
                        }}
                    ></div>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={handleSpin} 
                        disabled={!canSpin || isSpinning}
                        className="px-12 py-4 text-xl font-bold text-white rounded-lg shadow-lg bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600 transition-transform transform active:scale-95"
                    >
                        {isSpinning ? 'Spinning...' : 'SPIN'}
                    </button>
                    {!canSpin && !isSpinning && timeLeft && (
                         <div className="flex items-center justify-center p-3 mt-4 text-lg font-semibold text-blue-700 bg-blue-100 rounded-md dark:bg-blue-900 dark:text-blue-300">
                           <Clock className="w-6 h-6 mr-2" />
                           Next spin available in: {timeLeft}
                        </div>
                    )}
                     {spinResult && !isSpinning && (
                        <div className="flex items-center justify-center p-3 mt-4 text-lg font-semibold text-green-700 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-300">
                           <Star className="w-6 h-6 mr-2" />
                           {spinResult.value > 0 ? `Congratulations! You won ${spinResult.value} points!` : `Better luck next time!`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpinWheel;
