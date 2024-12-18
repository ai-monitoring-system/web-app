import React, { useState, useCallback, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek, addWeeks, subWeeks, getWeek } from "date-fns";
import { FaCalendarAlt, FaVideo, FaChevronLeft, FaChevronRight, FaClock, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
import "animate.css";

const VideoStorage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [lastEventTime, setLastEventTime] = useState(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const scrollContainerRef = useRef(null);

  // Add refs for animations
  const { ref: todayRef, inView: todayInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const { ref: calendarRef, inView: calendarInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Function to calculate time difference
  const getTimeSince = (timestamp) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInHours = Math.floor((now - eventTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - eventTime) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    }
    return `${diffInHours}h ago`;
  };

  // Function to update events
  const updateEvents = useCallback(() => {
    // Here you would typically fetch events from your backend
    // For now, we'll simulate with more mock data
    const mockEvents = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        title: "Motion Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "00:45",
        confidence: 89,
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        title: "Person Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "01:20",
        confidence: 95,
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        title: "Vehicle Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "00:30",
        confidence: 92,
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        title: "Package Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "01:15",
        confidence: 88,
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        title: "Animal Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "02:00",
        confidence: 85,
      },
      {
        id: 6,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        title: "Motion Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "00:55",
        confidence: 91,
      },
      {
        id: 7,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), // 7 hours ago
        title: "Person Detected",
        thumbnail: "https://via.placeholder.com/150",
        duration: "01:45",
        confidence: 94,
      },
      {
        id: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        title: "Unusual Activity",
        thumbnail: "https://via.placeholder.com/150",
        duration: "03:20",
        confidence: 87,
      }
    ];

    setTodaysEvents(mockEvents);
    
    // Update last event time
    if (mockEvents.length > 0) {
      const sortedEvents = [...mockEvents].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setLastEventTime(sortedEvents[0].timestamp);
    }
  }, []);

  // Set up polling for updates
  useEffect(() => {
    // Initial update
    updateEvents();

    // Poll for updates every minute
    const interval = setInterval(updateEvents, 60000);

    return () => clearInterval(interval);
  }, [updateEvents]);

  // Mock data for calendar events
  const events = {
    "2024-03-02": [
      { time: "9a", title: "Motion Detected - Front Door" },
      { time: "10a", title: "Person Detected - Backyard" },
      { time: "12p", title: "Vehicle Detected - Driveway" },
    ],
    "2024-03-03": [
      { time: "10a", title: "Motion Detected - Living Room" },
      { time: "11a", title: "Pet Detected - Kitchen" },
      { time: "12p", title: "Person Detected - Garage" },
    ],
    "2024-03-04": [
      { time: "10a", title: "Unusual Activity - Basement" },
    ],
    "2024-03-05": [
      { time: "10a", title: "Motion Detected - Side Gate" },
      { time: "11a", title: "Person Detected - Front Yard" },
    ],
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
  };

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => subWeeks(prevDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };

  const getDays = () => {
    if (view === 'month') {
      return eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      });
    } else {
      return eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      });
    }
  };

  const handlePrevious = () => {
    if (view === 'month') {
      handlePreviousMonth();
    } else {
      handlePreviousWeek();
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      handleNextMonth();
    } else {
      handleNextWeek();
    }
  };

  const getPeriodLabel = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `Week ${getWeek(currentDate)} (${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')})`;
    }
  };

  const handleDeleteEvent = (eventId) => {
    // Add confirmation dialog
    if (window.confirm('Are you sure you want to delete this event?')) {
      // Filter out the deleted event
      setTodaysEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      // In a real application, you would also make an API call to delete from backend
    }
  };

  // Add scroll check function
  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, scrollLeft, clientWidth } = scrollContainerRef.current;
      setCanScrollRight(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth);
      setCanScrollLeft(scrollLeft > 0);
    }
  }, []);

  // Add scroll handler
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Scroll one card width
        behavior: 'smooth'
      });
    }
  };

  // Add scroll left handler
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  // Check scroll on mount and when events change
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, todaysEvents]);

  return (
    <div className="space-y-8 max-w-[calc(100vw-16rem-4rem)] mx-auto">
      {/* Today's Events Section */}
      <section 
        ref={todayRef}
        className={`transform transition-all duration-1000 ease-out
          ${todayInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-t-xl p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-x-16 translate-y-16 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaVideo className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white">Today's Events</h2>
              </div>
              <div className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-white font-medium">
                  {format(new Date(), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <FaVideo className="text-lg" />
                <span>{todaysEvents.length} Events</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <FaClock className="text-lg" />
                <span>Last event: {lastEventTime ? getTimeSince(lastEventTime) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid with new design */}
        <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg px-6 py-6 relative">
          {/* Scroll container with relative positioning */}
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent -mx-6 px-6"
              onScroll={checkScroll}
            >
              {todaysEvents
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((event) => (
                  <div
                    key={event.id}
                    className={`flex-none w-[400px] snap-start snap-always group relative bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeIn animate__faster`}
                  >
                    {/* Make thumbnail taller */}
                    <div className="relative h-48">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <div className="flex items-center justify-between text-white">
                            <span className="text-sm font-medium">
                              {format(new Date(event.timestamp), 'h:mm a')}
                            </span>
                            <div className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              <span className="text-xs">{event.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event details - made more compact */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                          {event.title}
                        </h3>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium
                          ${event.confidence > 90 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {event.confidence}% Confidence
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                        >
                          <FaVideo className="text-xs" />
                          View Clip
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center"
                          title="Delete event"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                        <button 
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 text-sm"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handleScrollLeft}
              className={`absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg 
                flex items-center justify-center transition-all duration-300 z-10
                hover:scale-110 hover:shadow-xl
                ${canScrollLeft 
                  ? 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800' 
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                }
                group`}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            >
              <FaChevronLeft className="text-sm transform transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>

            <button
              onClick={handleScrollRight}
              className={`absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-lg 
                flex items-center justify-center transition-all duration-300 z-10
                hover:scale-110 hover:shadow-xl
                ${canScrollRight 
                  ? 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800' 
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                }
                group`}
              aria-label="Scroll right"
              disabled={!canScrollRight}
            >
              <FaChevronRight className="text-sm transform transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section 
        ref={calendarRef}
        className={`transform transition-all duration-1000 ease-out delay-300
          ${calendarInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-t-xl p-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-x-16 translate-y-16 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white">{getPeriodLabel()}</h2>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handlePrevious}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                  >
                    <FaChevronLeft className="text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                  >
                    <FaChevronRight className="text-white" />
                  </button>
                </div>
              </div>
              
              {/* View Toggle - Updated design */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
                {['Month', 'Week'].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType.toLowerCase())}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${view === viewType.toLowerCase() 
                        ? 'bg-white text-blue-600 shadow-sm transform scale-105' 
                        : 'text-white hover:bg-white/20'
                      }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 bg-transparent">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center py-3 text-sm font-semibold text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {getDays().map((date) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const dayEvents = events[dateKey] || [];
              const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateKey;
              
              return (
                <div
                  key={date.toString()}
                  className={`
                    group relative bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden
                    hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1
                    ${view === 'week' ? 'min-h-[500px]' : 'min-h-[120px]'}
                    ${!isSameMonth(date, currentDate) ? 'opacity-40' : ''}
                    ${isToday(date) ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                    ${isSelected ? 'shadow-lg bg-blue-50 dark:bg-blue-900/30' : ''}
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  {/* Date header */}
                  <div className="p-2 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className={`
                        font-medium text-lg
                        ${isToday(date) ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}
                      `}>
                        {format(date, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event list */}
                  <div className="p-2 space-y-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-blue-500 dark:text-blue-400 font-medium text-xs">
                          {event.time}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                          {event.title}
                        </span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="px-2 py-1 text-xs text-blue-500 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                        +{dayEvents.length - 3} more events
                      </div>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-200"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoStorage;
