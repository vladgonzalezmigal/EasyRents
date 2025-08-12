import { SVGIconProps } from '@/app/(private)/utils/styling';

export default function TrashIcon({ className = '', style, ...props }: SVGIconProps) {
    return (
        <svg
            width="34"
            height="39"
            viewBox="0 0 34 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            {...props}
        >
            <path
                d="M2 9.625H5.33333M5.33333 9.625H32M5.33333 9.625V32.9583C5.33333 33.8424 5.68452 34.6902 6.30964 35.3154C6.93477 35.9405 7.78261 36.2917 8.66667 36.2917H25.3333C26.2174 36.2917 27.0652 35.9405 27.6904 35.3154C28.3155 34.6902 28.6667 33.8424 28.6667 32.9583V9.625M10.3333 9.625V6.29167C10.3333 5.40761 10.6845 4.55976 11.3096 3.93464C11.9348 3.30952 12.7826 2.95833 13.6667 2.95833H20.3333C21.2174 2.95833 22.0652 3.30952 22.6904 3.93464C23.3155 4.55976 23.6667 5.40761 23.6667 6.29167V9.625M13.6667 17.9583V27.9583M20.3333 17.9583V27.9583"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
} 