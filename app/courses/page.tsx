'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const allCourses = [
  {
    id: 'cybershield',
    title: 'CyberShield',
    description: 'Master cybersecurity fundamentals and protect against digital threats',
    icon: '🛡️',
    level: 'Beginner',
    duration: '8 Weeks',
    features: [
      'Hands-on labs',
      'Real-world scenarios',
      'Industry-recognized certification'
    ],
    category: 'IT & Software',
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviews: 1243,
    hours: 120,
    instructor: 'Lisa Baker',
    isFree: false,
    image: '/assets/images/course/cybersecurity.jpg',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'ai-mastery',
    title: 'AI Mastery',
    description: 'Learn artificial intelligence and machine learning from the ground up',
    icon: '🤖',
    level: 'Intermediate',
    duration: '12 Weeks',
    features: [
      'TensorFlow projects',
      'Neural network design',
      'Model optimization'
    ],
    category: 'Development',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviews: 892,
    hours: 180,
    instructor: 'Kevin Taylor',
    isFree: false,
    image: '/assets/images/course/ai.jpg',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    description: 'Design and deploy scalable cloud solutions',
    icon: '☁️',
    level: 'Expert',
    duration: '10 Weeks',
    features: [
      'AWS/Azure/GCP',
      'Serverless architecture',
      'Cloud security'
    ],
    category: 'IT & Software',
    price: 0,
    rating: 4.5,
    reviews: 756,
    hours: 150,
    instructor: 'Catherine Parker',
    isFree: true,
    image: '/assets/images/course/cloud.jpg',
    color: 'from-cyan-500 to-brand'
  },
  {
    id: 'web-design',
    title: 'Modern Web Design',
    description: 'Create stunning websites with modern design principles',
    icon: '🎨',
    level: 'Beginner',
    duration: '6 Weeks',
    features: [
      'Responsive design',
      'UI/UX principles',
      'Portfolio projects'
    ],
    category: 'Design',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 1156,
    hours: 90,
    instructor: 'Brandy Carlson',
    isFree: false,
    image: '/assets/images/course/design.jpg',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Master digital marketing strategies and grow your business',
    icon: '📈',
    level: 'Intermediate',
    duration: '8 Weeks',
    features: [
      'SEO optimization',
      'Social media marketing',
      'Analytics and reporting'
    ],
    category: 'Marketing',
    price: 0,
    rating: 4.4,
    reviews: 623,
    hours: 120,
    instructor: 'Lisa Baker',
    isFree: true,
    image: '/assets/images/course/marketing.jpg',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'business-strategy',
    title: 'Business Strategy & Leadership',
    description: 'Develop strategic thinking and leadership skills',
    icon: '💼',
    level: 'Expert',
    duration: '10 Weeks',
    features: [
      'Strategic planning',
      'Team leadership',
      'Decision making'
    ],
    category: 'Business',
    price: 199.99,
    rating: 4.8,
    reviews: 445,
    hours: 160,
    instructor: 'Kevin Taylor',
    isFree: false,
    image: '/assets/images/course/business.jpg',
    color: 'from-orange-500 to-red-600'
  }
];

export default function CoursesGrid() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState(allCourses);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...allCourses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course => selectedCategories.includes(course.category));
    }

    // Apply rating filters
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(course => {
        return selectedRatings.some(rating => {
          if (rating === '5') return course.rating >= 4.8;
          if (rating === '4.5') return course.rating >= 4.5 && course.rating < 4.8;
          if (rating === '4') return course.rating >= 4.0 && course.rating < 4.5;
          if (rating === '3.5') return course.rating >= 3.5 && course.rating < 4.0;
          return false;
        });
      });
    }

    // Apply instructor filters
    if (selectedInstructors.length > 0) {
      filtered = filtered.filter(course => selectedInstructors.includes(course.instructor));
    }

    // Apply price filters
    if (selectedPrice.length > 0) {
      if (selectedPrice.includes('free') && !selectedPrice.includes('paid')) {
        filtered = filtered.filter(course => course.isFree);
      } else if (selectedPrice.includes('paid') && !selectedPrice.includes('free')) {
        filtered = filtered.filter(course => !course.isFree);
      }
    }

    // Apply level filters
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course => selectedLevels.includes(course.level));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered = filtered.reverse();
        break;
      case 'popularity':
        filtered = filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedCategories, selectedRatings, selectedInstructors, selectedPrice, selectedLevels, sortBy]);

  const handleCourseSelect = (courseId: string) => {
    setTimeout(() => {
      router.push(`/level-selection?course=${courseId}`);
    }, 500);
  };

  const handleFilterChange = (filterType: 'category' | 'rating' | 'instructor' | 'price' | 'level', value: string) => {
    switch (filterType) {
      case 'category':
        setSelectedCategories(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'rating':
        setSelectedRatings(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'instructor':
        setSelectedInstructors(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'price':
        setSelectedPrice(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'level':
        setSelectedLevels(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setSelectedInstructors([]);
    setSelectedPrice([]);
    setSelectedLevels([]);
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedRatings.length + selectedInstructors.length +
      selectedPrice.length + selectedLevels.length + (searchQuery ? 1 : 0);
  };

  // Get counts for filter options
  const getCategoryCount = (category: string) => 
    allCourses.filter(course => course.category === category).length;

  const getInstructorCount = (instructor: string) => 
    allCourses.filter(course => course.instructor === instructor).length;

  const getFreeCoursesCount = () => 
    allCourses.filter(course => course.isFree).length;

  const getPaidCoursesCount = () => 
    allCourses.filter(course => !course.isFree).length;

  const getLevelCount = (level: string) => 
    allCourses.filter(course => course.level === level).length;

  const getRatingCount = (rating: string) => {
    return allCourses.filter(course => {
      if (rating === '5') return course.rating >= 4.8;
      if (rating === '4.5') return course.rating >= 4.5 && course.rating < 4.8;
      if (rating === '4') return course.rating >= 4.0 && course.rating < 4.5;
      if (rating === '3.5') return course.rating >= 3.5 && course.rating < 4.0;
      return false;
    }).length;
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-8 mb-8 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Z-Learn Networking Academy
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            Develop technical skills through hands-on learning and prepare for networking careers
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Find courses, specializations, or instructors..."
              className="w-full py-3 pl-12 pr-5 bg-white/90 text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Catalog Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Course Catalog</h2>
          <p className="text-gray-600">
            {filteredCourses.length} of {allCourses.length} courses available
          </p>
        </div>
        
        {/* Filter/Sort Controls */}
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Sort by</option>
            <option value="newest">Newest</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 bg-white text-blue-800 text-sm rounded-full border border-blue-200">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategories.map(category => (
              <span key={category} className="inline-flex items-center px-3 py-1 bg-white text-blue-800 text-sm rounded-full border border-blue-200">
                {category}
                <button
                  onClick={() => handleFilterChange('category', category)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedLevels.map(level => (
              <span key={level} className="inline-flex items-center px-3 py-1 bg-white text-blue-800 text-sm rounded-full border border-blue-200">
                {level}
                <button
                  onClick={() => handleFilterChange('level', level)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedPrice.map(price => (
              <span key={price} className="inline-flex items-center px-3 py-1 bg-white text-blue-800 text-sm rounded-full border border-blue-200">
                {price === 'free' ? 'Free' : 'Paid'}
                <button
                  onClick={() => handleFilterChange('price', price)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="ml-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => handleCourseSelect(course.id)}
          >
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Course Header */}
              <div className={`bg-gradient-to-r ${course.color} p-4 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 bg-white/20 rounded-md text-xs font-medium mb-2">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-bold line-clamp-2">{course.title}</h3>
                  </div>
                  <div className="text-4xl opacity-80">{course.icon}</div>
                </div>
              </div>
              
              {/* Course Body */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">{course.duration}</span>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({course.reviews})</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {course.level}
                  </span>
                </div>
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    {course.isFree ? (
                      <span className="text-lg font-bold text-green-600">FREE</span>
                    ) : (
                      <div>
                        <span className="text-lg font-bold text-gray-900">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mt-4">No courses match your search</h3>
          <p className="text-gray-600 mt-2 mb-6">Try adjusting your filters or search terms</p>
          <button
            onClick={clearAllFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <button className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-blue-600 font-medium">1</button>
            <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">3</button>
            <span className="px-4 py-2 border border-gray-300 bg-white text-gray-700">...</span>
            <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">8</button>
            <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: "easeInOut", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Filter Courses</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Filter Sections */}
                <div className="flex-1 overflow-y-auto space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(allCourses.map(course => course.category))).map(category => (
                        <label key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleFilterChange('category', category)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">{category}</span>
                          </div>
                          <span className="text-sm text-gray-500">({getCategoryCount(category)})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Levels */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Skill Level</h3>
                    <div className="space-y-2">
                      {['Beginner', 'Intermediate', 'Expert'].map(level => (
                        <label key={level} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedLevels.includes(level)}
                              onChange={() => handleFilterChange('level', level)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">{level}</span>
                          </div>
                          <span className="text-sm text-gray-500">({getLevelCount(level)})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Price</h3>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPrice.includes('free')}
                            onChange={() => handleFilterChange('price', 'free')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-gray-700">Free Courses</span>
                        </div>
                        <span className="text-sm text-gray-500">({getFreeCoursesCount()})</span>
                      </label>
                      <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPrice.includes('paid')}
                            onChange={() => handleFilterChange('price', 'paid')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-gray-700">Paid Courses</span>
                        </div>
                        <span className="text-sm text-gray-500">({getPaidCoursesCount()})</span>
                      </label>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Ratings</h3>
                    <div className="space-y-2">
                      {[
                        { value: '5', label: '5 stars' },
                        { value: '4.5', label: '4.5+ stars' },
                        { value: '4', label: '4+ stars' },
                        { value: '3.5', label: '3.5+ stars' }
                      ].map(rating => (
                        <label key={rating.value} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedRatings.includes(rating.value)}
                              onChange={() => handleFilterChange('rating', rating.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex items-center ml-3">
                              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span className="text-gray-700">{rating.label}</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">({getRatingCount(rating.value)})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Instructors */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Instructors</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(allCourses.map(course => course.instructor))).map(instructor => (
                        <label key={instructor} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedInstructors.includes(instructor)}
                              onChange={() => handleFilterChange('instructor', instructor)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">{instructor}</span>
                          </div>
                          <span className="text-sm text-gray-500">({getInstructorCount(instructor)})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-auto border-t">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Show {filteredCourses.length} Courses
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}