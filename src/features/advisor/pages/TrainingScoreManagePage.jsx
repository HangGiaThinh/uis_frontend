import React from 'react';
import TrainingScoreTable from '../components/trainingscore/TrainingScoreTable';

function TrainingScoreManagePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý điểm rèn luyện</h1>
      <TrainingScoreTable />
    </div>
  );
}

export default TrainingScoreManagePage; 