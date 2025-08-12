// import { SVGProps } from 'react';

export interface SVGIconProps {
    className?: string;
    style?: React.CSSProperties;
}

export const drawDottedBackground = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    // Draw dots
    const drawDots = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const dotSize = 1;
        const spacing = 16;
        // const centerY = canvas.height / 2;
        // const centerX = canvas.width / 2;
        
        // Calculate number of rows and columns
        const rows = Math.ceil(canvas.height / spacing);
        const cols = Math.ceil(canvas.width / spacing);
        
        // Draw dots
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * spacing;
                const y = row * spacing;
                
                // Calculate distance from center in both directions
                // const distanceFromCenterY = Math.abs(y - centerY);
                // const distanceFromCenterX = Math.abs(x - centerX);
                // const maxDistanceY = canvas.height / 2;
                // const maxDistanceX = canvas.width / 2;
                
                // Calculate normalized distances (0 to 1)
                // const normalizedDistanceY = distanceFromCenterY / maxDistanceY;
                // const normalizedDistanceX = distanceFromCenterX / maxDistanceX;
                
                // Use the maximum of the two distances for opacity
                // const maxNormalizedDistance = Math.max(normalizedDistanceY, normalizedDistanceX);
                
                // Calculate opacity based on distance from center (reversed)
                const opacity = 0.35 
                // - (maxNormalizedDistance * 0.3);
                
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(128, 128, 128, ${opacity})`;
                ctx.fill();
            }
        }
    };

    // Initial setup
    resizeCanvas();
    drawDots();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawDots();
    });

    // Return cleanup function
    return () => {
        window.removeEventListener('resize', resizeCanvas);
    };
}; 