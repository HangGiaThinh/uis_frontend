import React, { useState } from 'react';
import TrainingScoreTable from '../components/trainingscore/TrainingScoreTable';
import CreateTrainingScoreModal from '../components/trainingscore/CreateTrainingScoreModal';
import AdjustTimeModal from '../components/trainingscore/AdjustTimeModal';
import { PlusCircle } from 'lucide-react';

function TrainingScoreManagePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const handleCreateSuccess = () => {
    // Có thể refresh data hoặc show notification
    console.log('Training score created successfully');
  };

  const handleAdjustSuccess = () => {
    // Có thể refresh data hoặc show notification
    console.log('Training score time adjusted successfully');
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#40ACE9]">
          Quản lý điểm rèn luyện - Phòng CTSV
        </h1>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group mt-4 md:mt-0"
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg> */}
            <PlusCircle className="w-4 h-4 group-hover:text-white" />
            Tạo điểm rèn luyện
          </button>
          
          <button
            onClick={() => setShowAdjustModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-[#F54900] text-[#F54900] rounded-md hover:bg-[#F54900] hover:text-white transition-colors duration-200 ease-in-out mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Điều chỉnh thời gian
          </button>
        </div>
      </div>

      {/* Training Score Table */}
      <TrainingScoreTable />

      {/* Modals */}
      <CreateTrainingScoreModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      
      <AdjustTimeModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onSuccess={handleAdjustSuccess}
      />
    </div>
  );
}

export default TrainingScoreManagePage; 