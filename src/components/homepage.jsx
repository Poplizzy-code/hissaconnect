import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ onStartLearning, onExploreCourses, onOpenCommunity, isAuthenticated }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Academic Success Starts Here
              </h1>
              <p className="text-xl text-red-100 mb-8">
                Join thousands of History & International Studies students excelling with HISSA Connect. Access verified resources, collaborate with peers, and achieve your academic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onStartLearning}
                  className="px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition text-center"
                >
                  Start Learning For Free
                </button>
                <button
                  onClick={onExploreCourses}
                  className="px-8 py-3 border-2 border-white text-white font-bold rounded hover:bg-red-800 transition text-center"
                >
                  Explore Courses
                </button>
              </div>
            </div>

            {/* Right Image/Icon */}
            <div className="hidden md:flex justify-center">
              <div className="w-96 h-96 bg-red-800 rounded-lg flex items-center justify-center text-6xl">
                📚
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Excel Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-600">Comprehensive tools to support your academic journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-red-900 text-white rounded-lg flex items-center justify-center text-3xl mb-4">
                📖
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lecture Resources</h3>
              <p className="text-gray-600">
                Access organized lecture notes, verified by instructors, and supplementary materials for every course.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-red-900 text-white rounded-lg flex items-center justify-center text-3xl mb-4">
                ✍️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Writing Tools</h3>
              <p className="text-gray-600">
                Essay templates, citation guides, and model answers to help you excel in your assignments and exams.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-red-900 text-white rounded-lg flex items-center justify-center text-3xl mb-4">
                💬
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Forum</h3>
              <p className="text-gray-600">
                Connect with peers, ask questions, share insights, and learn from discussions with fellow students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How HISSA Connect Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How HISSA Connect Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start your journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sign Up & Choose Courses</h3>
              <p className="text-gray-600">
                Create your free account and enroll in the courses you're taking this semester.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Access Resources & Tools</h3>
              <p className="text-gray-600">
                Browse lecture notes, past questions, writing templates, and study materials for each course.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Excel in Your Studies</h3>
              <p className="text-gray-600">
                Learn from peers, ask questions in forums, and achieve your academic goals with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Academic Resources</h2>
            <Link to="/resources" className="text-red-900 font-semibold hover:underline">
              View All Courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-6xl">
                📚
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-red-900 bg-red-100 px-3 py-1 rounded">HISTORY</span>
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">Ancient Civilizations</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore ancient Greece, Rome, Egypt and Mesopotamia with comprehensive notes and resources.
                </p>
                <button className="w-full py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition">
                  Access Resources
                </button>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl">
                🌍
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-red-900 bg-red-100 px-3 py-1 rounded">INT. STUDIES</span>
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">International Relations</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Master diplomacy, global politics, and international systems with expert guidance.
                </p>
                <button className="w-full py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition">
                  Access Resources
                </button>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-6xl">
                🏛️
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-red-900 bg-red-100 px-3 py-1 rounded">HISTORY</span>
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">20th Century Europe</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Study the Industrial Revolution through World Wars with detailed analysis and resources.
                </p>
                <button className="w-full py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition">
                  Access Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam & Writing Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Exam & Writing Tools</h2>
          <p className="text-xl text-gray-600 mb-12">Master your craft with our comprehensive guides</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Essay Templates</h3>
                  <p className="text-gray-600">
                    Structured templates for historical essays and international relations analysis to ensure you hit all the key points.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Citation Guides</h3>
                  <p className="text-gray-600">
                    Learn Chicago citation style with practical examples and common mistakes to avoid.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Model Answers</h3>
                  <p className="text-gray-600">
                    Study high-quality sample answers and understand what makes a response excellent.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Analysis Frameworks</h3>
                  <p className="text-gray-600">
                    Proven frameworks for analyzing historical events and international issues effectively.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Common Mistakes</h3>
                  <p className="text-gray-600">
                    Learn from common pitfalls and how to avoid them in your exams and assignments.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Exam Strategies</h3>
                  <p className="text-gray-600">
                    Time management and test-taking strategies from successful students and instructors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Forum Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Community Forum</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Forum Thread 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jane Doe</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How to structure a historical essay?</h3>
              <p className="text-gray-600 mb-4">
                I'm struggling with organizing my thoughts for the essay assignment. Any tips?
              </p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>💬 12 replies</span>
                <span>👁️ 45 views</span>
              </div>
            </div>

            {/* Forum Thread 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  CM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Chris Miller</p>
                  <p className="text-sm text-gray-500">1 week ago</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Best resources for Cold War research</h3>
              <p className="text-gray-600 mb-4">
                Looking for reliable sources for my research paper on Cold War diplomacy.
              </p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>💬 8 replies</span>
                <span>👁️ 32 views</span>
              </div>
            </div>

            {/* Forum Thread 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">International Relations case studies</h3>
              <p className="text-gray-600 mb-4">
                Anyone interested in forming a study group for our IR final project?
              </p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>💬 15 replies</span>
                <span>👁️ 67 views</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onOpenCommunity}
              className="inline-block px-8 py-3 bg-red-900 text-white font-bold rounded hover:bg-red-800 transition cursor-pointer"
            >
              Join the Community
            </button>
          </div>
        </div>
      </section>

      {/* Research & Opportunities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Research & Opportunities</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Opportunity 1 */}
            <div className="border-l-4 border-green-600 pl-6">
              <span className="text-sm font-bold text-green-600">SCHOLARSHIPS</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">Graduate Study Program</h3>
              <p className="text-gray-600 text-sm mb-4">
                Full and partial scholarships for History and International Studies graduate programs.
              </p>
              <button className="text-green-600 font-semibold hover:underline">Learn More →</button>
            </div>

            {/* Opportunity 2 */}
            <div className="border-l-4 border-blue-600 pl-6">
              <span className="text-sm font-bold text-blue-600">CONFERENCES</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">International Symposium 2024</h3>
              <p className="text-gray-600 text-sm mb-4">
                Call for papers on contemporary international relations and historical research.
              </p>
              <button className="text-blue-600 font-semibold hover:underline">Learn More →</button>
            </div>

            {/* Opportunity 3 */}
            <div className="border-l-4 border-purple-600 pl-6">
              <span className="text-sm font-bold text-purple-600">INTERNSHIPS</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">NGO & Think Tank Positions</h3>
              <p className="text-gray-600 text-sm mb-4">
                Gain practical experience with leading organizations in international development.
              </p>
              <button className="text-purple-600 font-semibold hover:underline">Learn More →</button>
            </div>

            {/* Opportunity 4 */}
            <div className="border-l-4 border-pink-600 pl-6">
              <span className="text-sm font-bold text-pink-600">RESEARCH GRANTS</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">Academic Research Funding</h3>
              <p className="text-gray-600 text-sm mb-4">
                Support for undergraduate and graduate research projects in History and IS.
              </p>
              <button className="text-pink-600 font-semibold hover:underline">Learn More →</button>
            </div>

            {/* Opportunity 5 */}
            <div className="border-l-4 border-yellow-600 pl-6">
              <span className="text-sm font-bold text-yellow-600">VOLUNTEERING</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">Cultural Exchange Programs</h3>
              <p className="text-gray-600 text-sm mb-4">
                Volunteer opportunities with international organizations and community projects.
              </p>
              <button className="text-yellow-600 font-semibold hover:underline">Learn More →</button>
            </div>

            {/* Opportunity 6 */}
            <div className="border-l-4 border-red-600 pl-6">
              <span className="text-sm font-bold text-red-600">CAREERS</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">Government & Diplomacy</h3>
              <p className="text-gray-600 text-sm mb-4">
                Career pathways in diplomacy, government service, and international relations.
              </p>
              <button className="text-red-600 font-semibold hover:underline">Learn More →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">HISSA Connect Pro</h2>
            <p className="text-xl text-gray-600">Unlock premium features to enhance your learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">N0<span className="text-lg text-gray-600">/month</span></p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Access all courses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Lecture notes & materials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Community forum</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-400">✗</span>
                  <span className="text-gray-400">AI feedback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-400">✗</span>
                  <span className="text-gray-400">Priority support</span>
                </li>
              </ul>

              <button className="w-full py-3 border-2 border-gray-300 text-gray-900 font-bold rounded hover:bg-gray-50 transition">
                Get Started
              </button>
            </div>

            {/* Pro Plan - Featured */}
            <div className="bg-red-900 text-white rounded-lg shadow-lg p-8 relative md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-red-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold mb-6">Pro</h3>
              <p className="text-4xl font-bold mb-6">N1000<span className="text-lg">/month</span></p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>AI-powered feedback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Advanced writing tools</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Premium resources</span>
                </li>
              </ul>

              <button className="w-full py-3 bg-white text-red-900 font-bold rounded hover:bg-gray-100 transition">
                Upgrade to Pro
              </button>
            </div>

            {/* Plus Plan */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Plus</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">N3000<span className="text-lg text-gray-600">/month</span></p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>1-on-1 tutoring sessions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Exclusive webinars</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Career guidance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>CV building assistance</span>
                </li>
              </ul>

              <button className="w-full py-3 border-2 border-red-900 text-red-900 font-bold rounded hover:bg-red-50 transition">
                Upgrade to Plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Excel?</h2>
          <p className="text-xl mb-8 text-red-100">
            Join thousands of students succeeding with HISSA Connect
          </p>
          <button
            onClick={onStartLearning}
            className="inline-block px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition cursor-pointer"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;