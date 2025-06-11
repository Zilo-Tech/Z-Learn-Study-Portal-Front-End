import React from 'react';

const EnrollmentList = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold mb-6 text-center">Your Enrollments</h1>
    <div className="space-y-6">
      {[1, 2].map((course) => (
        <div key={course} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Course Title {course}</h2>
            <p className="text-gray-600 mb-2">Instructor: Jane Doe</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: course === 1 ? '60%' : '30%'}}></div>
            </div>
            <span className="text-sm text-gray-500">Progress: {course === 1 ? '60%' : '30%'}</span>
          </div>
          <button className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Continue Learning</button>
        </div>
      ))}
    </div>
  </div>
);

export default EnrollmentList;
