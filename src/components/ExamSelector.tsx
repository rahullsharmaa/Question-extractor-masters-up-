import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Exam } from '../types';
import { ChevronDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExamSelectorProps {
  selectedExam: Exam | null;
  onExamSelect: (exam: Exam) => void;
}

const ExamSelector: React.FC<ExamSelectorProps> = ({ selectedExam, onExamSelect }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamDescription, setNewExamDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('name');

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = async () => {
    if (!newExamName.trim()) {
      toast.error('Exam name is required');
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([{
          name: newExamName.trim(),
          description: newExamDescription.trim() || null
        }])
        .select()
        .single();

      if (error) throw error;

      setExams([...exams, data]);
      setNewExamName('');
      setNewExamDescription('');
      setShowAddForm(false);
      toast.success('Exam added successfully');
    } catch (error) {
      console.error('Error adding exam:', error);
      toast.error('Failed to add exam');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <select
          value={selectedExam?.id || ''}
          onChange={(e) => {
            const exam = exams.find(ex => ex.id === e.target.value);
            if (exam) onExamSelect(exam);
          }}
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
        >
          <option value="">Select an exam...</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {selectedExam && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900">{selectedExam.name}</h3>
          {selectedExam.description && (
            <p className="text-sm text-blue-700 mt-1">{selectedExam.description}</p>
          )}
        </div>
      )}

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add New Exam
      </button>

      {showAddForm && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Name *
              </label>
              <input
                type="text"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="e.g., JEE Main, GATE, CAT"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newExamDescription}
                onChange={(e) => setNewExamDescription(e.target.value)}
                placeholder="Brief description of the exam"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddExam}
                disabled={adding}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'Adding...' : 'Add Exam'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSelector;