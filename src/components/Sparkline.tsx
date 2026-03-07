import { SPARKLINES } from '../data';

interface SparklineProps {
    gas: keyof typeof SPARKLINES;
    color?: string;
}

export function Sparkline({ gas, color = '#6ECCDB' }: SparklineProps) {
    const data = SPARKLINES[gas];
    const w = 120, h = 40, pad = 4;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={w} height={h} className="overflow-visible">
            <defs>
                <linearGradient id={`grad-${gas}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Fill area */}
            <polygon
                points={`${points} ${w - pad},${h} ${pad},${h}`}
                fill={`url(#grad-${gas})`}
            />
            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Last point dot */}
            {(() => {
                const last = data[data.length - 1];
                const x = w - pad;
                const y = h - pad - ((last - min) / range) * (h - pad * 2);
                return <circle cx={x} cy={y} r="3" fill={color} />;
            })()}
        </svg>
    );
}

