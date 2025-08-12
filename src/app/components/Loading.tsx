'use client';

import React from 'react';

export function Loading() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#0C3C74] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}