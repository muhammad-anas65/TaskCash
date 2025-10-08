import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../App';
import { Clock, Star, Gift, X } from 'lucide-react';

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
    const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

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
        
        const winningSegmentMiddleAngle = (winningSegmentIndex * segmentAngle) + (segmentAngle / 2);
        const targetAngle = 360 - winningSegmentMiddleAngle;

        const fullRotations = 360 * 8; 
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

            setIsPrizeModalOpen(true);

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

        }, 7000); 
    };
    
    const conicGradient = useMemo(() => {
         const segmentAngle = 360 / segments.length;
         const gradientParts = segments.map((seg, i) => {
             const startAngle = i * segmentAngle;
             const endAngle = (i + 1) * segmentAngle;
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
                        className="absolute text-primary-500 top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 drop-shadow-lg"
                        style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)', width: '30px', height: '40px', backgroundColor: 'currentColor' }}
                    />
                    <div 
                        className="absolute w-full h-full rounded-full"
                        style={{ 
                            background: conicGradient,
                            transition: 'transform 7s cubic-bezier(0.215, 0.61, 0.355, 1)',
                            transform: `rotate(${rotation}deg)`
                        }}
                    >
                        {segments.map((_, index) => (
                            <div
                                key={`divider-${index}`}
                                className="absolute top-0 left-0 w-full h-full"
                                style={{ transform: `rotate(${(360 / segments.length) * index}deg)` }}
                            >
                                <div className="h-1/2 w-px bg-white/30 mx-auto"></div>
                            </div>
                        ))}

                         {segments.map((segment, index) => {
                            const angle = (360 / segments.length) * (index + 0.5);
                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{ transform: `rotate(${angle}deg)` }}
                                >
                                    <div className="absolute flex items-center justify-center w-[45%] text-white font-bold text-base -translate-y-1/2 top-1/2 left-1/2 origin-left">
                                        {segment.value > 0 ? (
                                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-300 fill-current" /> {segment.label}</span>
                                        ) : (
                                            <span>{segment.label}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="absolute w-12 h-12 bg-white border-4 border-gray-300 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 dark:bg-gray-700 dark:border-gray-500 shadow-inner"></div>
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
                </div>
            </div>
            {isPrizeModalOpen && spinResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in-up">
                    <div className="relative w-full max-w-sm p-8 mx-4 text-center bg-white rounded-2xl shadow-xl dark:bg-gray-800">
                        <div className={`flex items-center justify-center w-20 h-20 mx-auto -mt-20 rounded-full border-4 border-white dark:border-gray-800 ${spinResult.value > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                            {spinResult.value > 0 ? <Gift className="w-10 h-10 text-white" /> : <X className="w-10 h-10 text-white" />}
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                            {spinResult.value > 0 ? `Congratulations!` : 'Oh No!'}
                        </h2>
                        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                            {spinResult.value > 0 ? (
                                <>You've won <span className="font-bold text-primary-500">{spinResult.value} points!</span></>
                            ) : (
                                "Better luck next time. Try again tomorrow!"
                            )}
                        </p>
                        <button
                            onClick={() => setIsPrizeModalOpen(false)}
                            className="w-full px-4 py-3 mt-8 font-semibold text-white rounded-lg bg-primary-600 hover:bg-primary-700"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpinWheel;