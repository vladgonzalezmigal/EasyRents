'use client';

import React from 'react';
import PlusIcon from "@/app/(private)/components/svgs/PlusIcon";
import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";

interface CurEmployeeBtnsProps {
  showCurrentEmployees: boolean;
  disabled?: boolean;
  onSubmit?: () => void;
  onDelete?: () => void;
  cudLoading?: boolean;
  hasNullValue?: boolean;
  deleteMode: boolean;
  canDelete: boolean;
}

export default function CurEmployeeBtns({
  showCurrentEmployees,
  onSubmit,
  onDelete,
  cudLoading = false,
  hasNullValue = false,
  deleteMode = false,
  canDelete = false
}: CurEmployeeBtnsProps) {
  // Determine which action is active
  const isDeleteActive = deleteMode;
  const isCreateActive = !deleteMode;

  return (
    <div className="w-full relative h-[148px] bg-[#F2FBFA] border border-t-0 border-[#ECECEE] header-shadow rounded-bottom z-0 mt-[-20px]">
      <div className="flex flex-row gap-x-4 items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
        {/* Delete Button */}
        <div className="flex flex-col items-center gap-y-2">
          <button
            onClick={onDelete}
            disabled={cudLoading || !showCurrentEmployees}
            className={`rounded-full w-16 h-16 border-2 border-[#A72020] flex items-center justify-center ${
                cudLoading ? 'bg-gray-400' :
                deleteMode ? 'bg-[#FA7B7D]' : 'bg-[#F8D2D2]'
            } ${!showCurrentEmployees ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer '} ${!isDeleteActive && showCurrentEmployees ? 'opacity-50' : ''}`}
          >
            {cudLoading ? (
                <span className="text-white">...</span>
            ) : (
                <span className="text-white">
                    <TrashIcon className={deleteMode ? (canDelete ? "text-[#A72020]" : "text-white") : "text-[#A72020]"} />
                </span>
            )}
          </button>
          <p className={`action-btn-text ${!showCurrentEmployees || (!isDeleteActive && showCurrentEmployees) ? 'opacity-50' : ''}`}>Delete</p>
        </div>

        {/* Create Button */}
        <div className="flex flex-col items-center gap-y-2">
          <button
            onClick={onSubmit ? (e) => {
              e.preventDefault();
              onSubmit();
            } : undefined}
            disabled={!showCurrentEmployees || cudLoading || hasNullValue || !isCreateActive}
            className={`rounded-full w-16 h-16 border-2 border-[#8ABBFD] bg-[#DFF4F3] flex items-center justify-center ${
              !showCurrentEmployees || cudLoading || hasNullValue || !isCreateActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {cudLoading ? (
              <span className="text-white">...</span>
            ) : (
              <span className="text-white">
                <PlusIcon className="text-[#8ABBFD] w-10 h-10" />
              </span>
            )}
          </button>
          <p className={`action-btn-text ${!showCurrentEmployees || cudLoading || hasNullValue || !isCreateActive ? 'opacity-50' : ''}`}>
            Create
          </p>
        </div>
      </div>
    </div>
  );
}
