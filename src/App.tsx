import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import ExamSelector from './components/ExamSelector';
import CourseSelector from './components/CourseSelector';
import QuestionTypeConfig from './components/QuestionTypeConfig';
import PDFUploader from './components/PDFUploader';
import QuestionExtractor from './components/QuestionExtractor';
import { Exam, Course, QuestionTypeSettings } from './types';

function App() {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [slot, setSlot] = useState<string>('');
  const [part, setPart] = useState<string>('');
  const [questionTypeSettings, setQuestionTypeSettings] = useState<QuestionTypeSettings>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isConfigComplete, setIsConfigComplete] = useState(false);

  // Check if configuration is complete
  useEffect(() => {
    const hasSelectedTypes = Object.keys(questionTypeSettings).length > 0;
    const allTypesConfigured = Object.values(questionTypeSettings).every(
      settings => settings.correctMarks !== undefined && 
                 settings.incorrectMarks !== undefined && 
                 settings.skippedMarks !== undefined && 
                 settings.partialMarks !== undefined && 
                 settings.timeMinutes !== undefined
    );
    
    setIsConfigComplete(
      selectedExam !== null && 
      selectedCourse !== null && 
      slot.trim() !== '' && 
      part.trim() !== '' && 
      hasSelectedTypes && 
      allTypesConfigured
    );
  }, [selectedExam, selectedCourse, slot, part, questionTypeSettings]);

  const handleReset = () => {
    setSelectedExam(null);
    setSelectedCourse(null);
    setSlot('');
    setPart('');
    setQuestionTypeSettings({});
    setUploadedFiles([]);
    setIsConfigComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Question Extractor
            </h1>
            <p className="text-lg text-gray-600">
              Extract and categorize questions from PDF files
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Exam Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Step 1: Select Exam
              </h2>
              <ExamSelector 
                selectedExam={selectedExam}
                onExamSelect={setSelectedExam}
              />
            </div>

            {/* Step 2: Course Selection */}
            {selectedExam && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 2: Select Course
                </h2>
                <CourseSelector 
                  examId={selectedExam.id}
                  selectedCourse={selectedCourse}
                  onCourseSelect={setSelectedCourse}
                />
              </div>
            )}

            {/* Step 3: Slot and Part Configuration */}
            {selectedCourse && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 3: Configure Slot and Part
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slot
                    </label>
                    <input
                      type="text"
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      placeholder="e.g., Morning, Afternoon, Slot 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part
                    </label>
                    <input
                      type="text"
                      value={part}
                      onChange={(e) => setPart(e.target.value)}
                      placeholder="e.g., Part A, Part B, Section 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      min="2000"
                      max="2030"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Question Type Configuration */}
            {selectedCourse && slot && part && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 4: Configure Question Types
                </h2>
                <QuestionTypeConfig 
                  questionTypeSettings={questionTypeSettings}
                  onSettingsChange={setQuestionTypeSettings}
                />
              </div>
            )}

            {/* Step 5: PDF Upload */}
            {isConfigComplete && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 5: Upload PDF Files
                </h2>
                <PDFUploader 
                  onFilesUploaded={setUploadedFiles}
                  uploadedFiles={uploadedFiles}
                />
              </div>
            )}

            {/* Step 6: Extract Questions */}
            {isConfigComplete && uploadedFiles.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 6: Extract Questions
                </h2>
                <QuestionExtractor 
                  files={uploadedFiles}
                  courseId={selectedCourse!.id}
                  slot={slot}
                  part={part}
                  year={year}
                  questionTypeSettings={questionTypeSettings}
                  onComplete={handleReset}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;