import { SVGProps } from 'react';

interface PlusIconProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

export default function PlusIcon({ className = '', ...props }: PlusIconProps) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M9.99967 1.83334V18.1667M1.83301 10H18.1663"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
} 