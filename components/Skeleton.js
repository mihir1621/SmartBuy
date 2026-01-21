export default function Skeleton({ className = "", ...props }) {
    return (
        <div
            className={`animate-pulse bg-gray-800/50 rounded-md ${className}`}
            {...props}
        />
    );
}
