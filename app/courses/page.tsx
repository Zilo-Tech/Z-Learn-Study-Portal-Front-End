'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function CoursesGrid() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Fetch courses from API
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get('/courses/');
        // Map API response to UI fields
        const mappedCourses: Course[] = (res.data || []).map((course: Record<string, unknown>) => ({
          id: course.id?.toString() ?? '',
          title: course.title as string,
          description: course.description as string,
          icon: '📘', // Default icon, or map if available
          level: course.level as string,
          duration: course.duration as string,
          features: (course.features as string[]) || [],
          category: course.category as string,
          price: parseFloat(course.price as string),
          originalPrice: undefined, // Not in API
          rating: course.rating as number,
          reviews: course.reviews as number,
          hours: course.hours as number,
          instructor: course.instructor as string,
          isFree: course.is_free as boolean,
          image: (course.image as string) || '/assets/images/course/default.jpg',
          color: (course.color as string) || 'from-blue-500 to-purple-600',
        }));
        setAllCourses(mappedCourses);
        setFilteredCourses(mappedCourses); // Initialize filteredCourses
      } catch {
        setAllCourses([]);
        setFilteredCourses([]); // Reset filteredCourses on error
      }
    }
    fetchCourses();
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...allCourses];

    // Apply filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course => selectedCategories.includes(course.category));
    }

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

    if (selectedInstructors.length > 0) {
      filtered = filtered.filter(course => selectedInstructors.includes(course.instructor));
    }

    if (selectedPrice.length > 0) {
      if (selectedPrice.includes('free') && !selectedPrice.includes('paid')) {
        filtered = filtered.filter(course => course.isFree);
      } else if (selectedPrice.includes('paid') && !selectedPrice.includes('free')) {
        filtered = filtered.filter(course => !course.isFree);
      }
    }

    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course => selectedLevels.includes(course.level));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // Since we don't have dates, we'll sort by ID
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
  }, [allCourses, selectedCategories, selectedRatings, selectedInstructors, selectedPrice, selectedLevels, sortBy]);

  interface Course {
    id: string;
    title: string;
    description: string;
    icon: string;
    level: string;
    duration: string;
    features: string[];
    category: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    hours: number;
    instructor: string;
    isFree: boolean;
    image: string;
    color: string;
  }



  interface FilterChangeHandler {
    filterType: 'category' | 'rating' | 'instructor' | 'price' | 'level';
    value: string;
  }

  const handleFilterChange = (p0: string, category: string, { filterType, value }: FilterChangeHandler): void => {
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
  };

  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedRatings.length + selectedInstructors.length +
      selectedPrice.length + selectedLevels.length;
  };

  // Get counts for each filter option
  const getCategoryCount = (category: string) => allCourses.filter(course => course.category === category).length;
  const getInstructorCount = (instructor: string): number => allCourses.filter((course: Course) => course.instructor === instructor).length;
  const getFreeCoursesCount = () => allCourses.filter(course => course.isFree).length;
  const getPaidCoursesCount = () => allCourses.filter(course => !course.isFree).length;
  const getLevelCount = (level: string) => allCourses.filter(course => course.level === level).length;
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1250px] mx-auto relative">
      <div className="max-w-7xl mx-auto">
       


        {/* Filter Top Bar */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Showing <span className="font-semibold">1-{filteredCourses.length}</span> of <span className="font-semibold">{allCourses.length}</span> results
          </p>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>Filter</span>
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default Sorting</option>
              <option value="newest">Newest First</option>
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Active Filters:</h4>
              <button
                onClick={clearAllFilters}
                className="text-sm text-brand hover:text-brand/90"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <span key={category} className="inline-flex items-center px-3 py-1 bg-blue-100 text-brand/90 text-sm rounded-full">
                  {category}
                  <button
                    onClick={() => handleFilterChange('category', category, { filterType: 'category', value: category })}
                    className="ml-2 text-brand hover:text-brand/90"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedInstructors.map(instructor => (
                <span key={instructor} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {instructor}
                  <button
                    onClick={() => handleFilterChange('instructor', instructor, { filterType: 'instructor', value: instructor })}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedLevels.map(level => (
                <span key={level} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {level}
                  <button
                    onClick={() => handleFilterChange('level', level, { filterType: 'level', value: level })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl border hover:shadow-lg overflow-hidden transform transition-all duration-300 group-hover:scale-[1.02]">
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {course.icon}
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  {course.isFree && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Category and Price */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs  text-gray-900 font-semibold bg-blue-50 rounded-full">
                      {course.category}
                    </span>
                    <div className="text-right">
                      {course.isFree ? (
                        <span className="text-lg font-bold text-green-600">FREE</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ${course.price}
                          </span>
                          {course.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>{course.rating} ({course.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand transition-colors duration-300">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center mb-4 text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {course.instructor}
                  </div>

                  {/* Features */}
                  {course.features && course.features.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {course.features.slice(0, 2).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-transparent border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-300 group/btn"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/courses/${course.id}`);
                    }}
                  >
                    <span className="font-medium">View Course</span>
                    <div className="flex space-x-1 transform group-hover/btn:translate-x-1 transition-transform duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/80 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredCourses.length > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button className="px-4 py-2 bg-brand text-white rounded-lg font-medium">1</button>
              <button className="px-4 py-2 text-gray-700 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors">2</button>
              <button className="px-4 py-2 text-gray-700 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors">3</button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-4 py-2 text-gray-700 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors">12</button>

              <button className="p-2 text-gray-500 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/0 z-40"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Clear All Filters */}
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full mb-6 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Clear All Filters ({getActiveFiltersCount()})
                  </button>
                )}

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {['Design', 'IT & Software', 'Development', 'Marketing', 'Business'].map(category => (
                      <label key={category} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleFilterChange('category', category, { filterType: 'category', value: category })}
                            className="mr-3 text-brand focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{category}</span>
                        </div>
                        <span className="text-gray-500 text-sm">({getCategoryCount(category)})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ratings</h3>
                  <div className="space-y-2">
                    {[
                      { value: '5', label: '5 stars', min: 4.8 },
                      { value: '4.5', label: '4.5 stars', min: 4.5 },
                      { value: '4', label: '4 stars', min: 4.0 },
                      { value: '3.5', label: '3.5 stars', min: 3.5 }
                    ].map(rating => (
                      <label key={rating.value} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating.value)}
                            onChange={() => handleFilterChange('rating', rating.value, { filterType: 'rating', value: rating.value })}
                            className="mr-3 text-brand focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-gray-700">{rating.label}</span>
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">({getRatingCount(rating.value)})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Instructors Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Instructors</h3>
                  <div className="space-y-2">
                    {['Lisa Baker', 'Brandy Carlson', 'Kevin Taylor', 'Catherine Parker'].map(instructor => (
                      <label key={instructor} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedInstructors.includes(instructor)}
                            onChange={() => handleFilterChange('instructor', instructor, { filterType: 'instructor', value: instructor })}
                            className="mr-3 text-brand focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{instructor}</span>
                        </div>
                        <span className="text-gray-500 text-sm">({getInstructorCount(instructor)})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPrice.includes('all')}
                          onChange={() => handleFilterChange('price', 'all', { filterType: 'price', value: 'all' })}
                          className="mr-3 text-brand focus:ring-blue-500"
                        />
                        <span className="text-gray-700">All</span>
                      </div>
                      <span className="text-gray-500 text-sm">({allCourses.length})</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPrice.includes('free')}
                          onChange={() => handleFilterChange('price', 'free', { filterType: 'price', value: 'free' })}
                          className="mr-3 text-brand focus:ring-blue-500"
                        />
                        <span className="text-gray-700">FREE</span>
                      </div>
                      <span className="text-gray-500 text-sm">({getFreeCoursesCount()})</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPrice.includes('paid')}
                          onChange={() => handleFilterChange('price', 'paid', { filterType: 'price', value: 'paid' })}
                          className="mr-3 text-brand focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Paid</span>
                      </div>
                      <span className="text-gray-500 text-sm">({getPaidCoursesCount()})</span>
                    </label>
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Level</h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLevels.length === 0}
                          onChange={() => setSelectedLevels([])}
                          className="mr-3 text-brand focus:ring-blue-500"
                        />
                        <span className="text-gray-700">All Levels</span>
                      </div>
                      <span className="text-gray-500 text-sm">({allCourses.length})</span>
                    </label>
                    {['Beginner', 'Intermediate', 'Expert'].map(level => (
                      <label key={level} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => handleFilterChange('level', level, { filterType: 'level', value: level })}
                            className="mr-3 text-brand focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{level}</span>
                        </div>
                        <span className="text-gray-500 text-sm">({getLevelCount(level)})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-brand text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Filters ({filteredCourses.length} courses)
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}