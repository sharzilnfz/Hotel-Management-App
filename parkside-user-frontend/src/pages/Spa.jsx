import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/custom-room-equal-height.css';
import { ContentContext } from '../contexts/ContentContext';

const Spa = () => {
  const { spaContent, loading, error, fetchSpaContent } =
    useContext(ContentContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [spaServices, setSpaServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [servicesLoading, setServicesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const servicesPerPage = 6;

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch spa services
  const fetchSpaServices = async () => {
    setServicesLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/spa/services');
      const data = await response.json();
      if (data.success) {
        setSpaServices(data.data);
        setFilteredServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching spa services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.filter((cat) => cat.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch specialists
  const fetchSpecialists = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/specialists');
      const data = await response.json();
      if (data.success) {
        setSpecialists(data.data.filter((spec) => spec.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching specialists:', error);
    }
  };

  // Filter services based on selected filters
  const filterServices = () => {
    let filtered = spaServices;

    if (selectedCategory) {
      filtered = filtered.filter(
        (service) =>
          service.categoryId && service.categoryId._id === selectedCategory
      );
    }

    if (selectedSpecialist) {
      filtered = filtered.filter(
        (service) => service.specialistId === selectedSpecialist
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    // Fetch all data when component mounts
    if (!spaContent) {
      fetchSpaContent();
    }
    fetchSpaServices();
    fetchCategories();
    fetchSpecialists();

    // Set background images
    const bgElements = document.querySelectorAll('[data-bg]');
    bgElements.forEach((element) => {
      const bgImage = element.getAttribute('data-bg');
      element.style.backgroundImage = `url(${bgImage})`;
    });
  }, [spaContent, fetchSpaContent]);

  // Apply filters when dependencies change
  useEffect(() => {
    filterServices();
  }, [selectedCategory, selectedSpecialist, searchTerm, spaServices]);

  // Calculate pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format price helper
  const formatPrice = (price) => `$${price}`;

  // Get image URL helper
  const getServiceImageUrl = (service) => {
    if (
      service?.images &&
      service.images.length > 0 &&
      service.images[0] !== 'placeholder-image.jpg'
    ) {
      return `http://localhost:4000/uploads/services/${service.images[0]}`;
    }
    return `http://localhost:4000/uploads/content/image-1748947475438-981074244.jpeg`;
  };

  // Get specialist photo
  const getSpecialistPhoto = (specialistId) => {
    const specialist = specialists.find((s) => s._id === specialistId);
    if (specialist && specialist.photo) {
      return `http://localhost:4000/uploads/specialists/${specialist.photo}`;
    }
    return '/assets/images/default-specialist.jpg';
  };

  // Get lowest price from durations
  const getLowestPrice = (durations) => {
    if (!durations || durations.length === 0) return 100;
    return Math.min(...durations.map((d) => d.price));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSpecialist('');
    setSearchTerm('');
  };

  // Booking functions
  const openBookingModal = (service) => {
    setSelectedService(service);
    setSelectedDuration('');
    setSelectedDate('');
    setSelectedTime('');
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
    setSelectedDuration('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleBooking = () => {
    // Handle the booking submission here
    const bookingData = {
      serviceId: selectedService._id,
      duration: selectedDuration,
      date: selectedDate,
      time: selectedTime,
    };
    console.log('Booking data:', bookingData);
    // Add your booking API call here
    closeBookingModal();
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  return (
    <>
      {/* Hero section */}
      <div className="content-section parallax-section hero-section hidden-section">
        <div
          className="bg par-elem"
          data-bg={
            spaContent?.coverImage
              ? `http://localhost:4000${spaContent.coverImage}`
              : `http://localhost:4000/uploads/content/image-1748947475438-981074244.jpeg`
          }
        ></div>
        <div className="overlay"></div>
        <div className="container">
          <div className="section-title">
            <h4>
              {spaContent?.description ||
                'Relax and rejuvenate your body and mind.'}
            </h4>
            <h2>{spaContent?.title || 'Luxurious Spa Services'}</h2>
            <div className="section-separator">
              <span>
                <i className="fa-thin fa-gem"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="hero-section-scroll">
          <div className="mousey">
            <div className="scroller"></div>
          </div>
        </div>
        <div className="dec-corner dc_lb"></div>
        <div className="dec-corner dc_rb"></div>
        <div className="dec-corner dc_rt"></div>
        <div className="dec-corner dc_lt"></div>
      </div>
      {/* Hero section end */}

      {/* Content */}
      <div className="content">
        {/* Breadcrumbs */}
        <div className="breadcrumbs-wrap">
          <div className="container">
            <Link to="/">Home</Link>
            <span>{spaContent?.pageTitle || 'Spa Services'}</span>
          </div>
        </div>
        {/* Breadcrumbs end */}

        {/* Main section */}
        <div className="content-section">
          <div className="section-dec"></div>
          <div className="container small-container">
            <div className="section-title">
              <h4>{spaContent?.sectionSubtitle || 'Ultimate Relaxation'}</h4>
              <h2>{spaContent?.sectionTitle || 'Spa & Wellness Services'}</h2>
              <div className="section-separator">
                <span>
                  <i className="fa-thin fa-gem"></i>
                </span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="container">
            <div className="spa-filters-section">
              <div className="filters-header">
                <h3>Find Your Perfect Service</h3>
                <div className="active-filters">
                  {(selectedCategory || selectedSpecialist || searchTerm) && (
                    <button
                      className="clear-filters-btn"
                      onClick={clearFilters}
                    >
                      <i className="fa-light fa-times"></i> Clear All Filters
                    </button>
                  )}
                </div>
              </div>

              <div className="filters-row">
                <div className="filter-group">
                  <label>Search Services:</label>
                  <div className="search-input-wrap">
                    <input
                      type="text"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <i className="fa-light fa-search"></i>
                  </div>
                </div>

                <div className="filter-group">
                  <label>Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name} ({category.serviceCount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Specialist:</label>
                  <select
                    value={selectedSpecialist}
                    onChange={(e) => setSelectedSpecialist(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Specialists</option>
                    {specialists.map((specialist) => (
                      <option key={specialist._id} value={specialist._id}>
                        {specialist.firstName} {specialist.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="results-info">
                <span>
                  Showing {filteredServices.length} service
                  {filteredServices.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="dec-container">
              <div className="dc_dec-item_left">
                <span></span>
              </div>
              <div className="dc_dec-item_right">
                <span></span>
              </div>
              <div className="text-block">
                {/* Services Grid */}
                <div className="spa-services-grid">
                  {servicesLoading ? (
                    <div className="loading-indicator">
                      <div className="loading-spinner"></div>
                      <p>Loading spa services...</p>
                    </div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : filteredServices.length === 0 ? (
                    <div className="no-services-message">
                      <i className="fa-light fa-spa"></i>
                      <h3>No services found</h3>
                      <p>Try adjusting your filters or search terms</p>
                    </div>
                  ) : (
                    currentServices.map((service) => (
                      <div className="spa-service-card" key={service._id}>
                        <div className="service-card-image">
                          <img
                            src={getServiceImageUrl(service)}
                            alt={service.title}
                          />
                          <div className="service-badge">
                            {service.isPopular && (
                              <span className="popular-badge">Popular</span>
                            )}
                            <span
                              className={`status-badge ${service.displayStatus}`}
                            >
                              {service.displayStatus}
                            </span>
                          </div>
                          <div className="service-overlay">
                            <button
                              className="quick-book-btn"
                              onClick={() => openBookingModal(service)}
                            >
                              <i className="fa-light fa-calendar-check"></i>
                              Book Now
                            </button>
                          </div>
                        </div>

                        <div className="service-card-content">
                          <div className="service-category">
                            <i className="fa-light fa-tag"></i>
                            {service.categoryId?.name || 'Wellness'}
                          </div>

                          <h3 className="service-title">
                            <Link to={`/spa-service/${service._id}`}>
                              {service.title}
                            </Link>
                          </h3>

                          <p className="service-description">
                            {service.description?.length > 100
                              ? `${service.description.substring(0, 100)}...`
                              : service.description}
                          </p>

                          <div className="service-specialist">
                            <div className="specialist-info">
                              <img
                                src={getSpecialistPhoto(service.specialistId)}
                                alt={service.specialist}
                                className="specialist-avatar"
                              />
                              <div>
                                <span className="specialist-name">
                                  {service.specialist}
                                </span>
                                <span className="specialist-label">
                                  Specialist
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="service-details">
                            <div className="service-features">
                              <div className="feature">
                                <i className="fa-light fa-clock"></i>
                                <span>
                                  {service.durations?.[0]?.duration || 60} min
                                </span>
                              </div>
                              <div className="feature">
                                <i className="fa-light fa-calendar"></i>
                                <span>{service.availability}</span>
                              </div>
                              {service.isRefundable && (
                                <div className="feature">
                                  <i className="fa-light fa-shield-check"></i>
                                  <span>Refundable</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="service-card-footer">
                            <div className="service-price">
                              <span className="price-from">From</span>
                              <span className="price-amount">
                                {formatPrice(getLowestPrice(service.durations))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Services Grid end */}
              </div>
            </div>

            {/* Pagination */}
            {!servicesLoading &&
              !error &&
              filteredServices.length > 0 &&
              totalPages > 1 && (
                <div className="pagination">
                  <a
                    href="#"
                    className="prevposts-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) paginate(currentPage - 1);
                    }}
                  >
                    <i className="fa fa-caret-left"></i>
                  </a>

                  {[...Array(totalPages)].map((_, i) => (
                    <a
                      href="#"
                      key={i + 1}
                      className={currentPage === i + 1 ? 'current-page' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(i + 1);
                      }}
                    >
                      {i + 1}
                    </a>
                  ))}

                  <a
                    href="#"
                    className="nextposts-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) paginate(currentPage + 1);
                    }}
                  >
                    <i className="fa fa-caret-right"></i>
                  </a>
                </div>
              )}
            {/* Pagination end */}
          </div>
        </div>
        {/* Main section end */}
        <div className="content-dec">
          <span></span>
        </div>
      </div>
      {/* Content end */}

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="booking-modal-overlay" onClick={closeBookingModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book {selectedService.title}</h3>
              <button className="close-btn" onClick={closeBookingModal}>
                <i className="fa-light fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="service-info">
                <img
                  src={getServiceImageUrl(selectedService)}
                  alt={selectedService.title}
                  className="service-image"
                />
                <div className="service-details">
                  <h4>{selectedService.title}</h4>
                  <p className="service-category">
                    <i className="fa-light fa-tag"></i>
                    {selectedService.categoryId?.name || 'Wellness'}
                  </p>
                  <p className="service-specialist">
                    <i className="fa-light fa-user"></i>
                    {selectedService.specialist}
                  </p>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Select Duration:</label>
                  <div className="duration-options">
                    {selectedService.durations?.map((duration, index) => (
                      <div
                        key={index}
                        className={`duration-option ${
                          selectedDuration === duration.duration
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => setSelectedDuration(duration.duration)}
                      >
                        <div className="duration-time">
                          {duration.duration} min
                        </div>
                        <div className="duration-price">${duration.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="date-input"
                  />
                </div>

                <div className="form-group">
                  <label>Select Time:</label>
                  <div className="time-slots">
                    {generateTimeSlots().map((time) => (
                      <button
                        key={time}
                        className={`time-slot ${
                          selectedTime === time ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDuration && (
                  <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <div className="summary-item">
                      <span>Service:</span>
                      <span>{selectedService.title}</span>
                    </div>
                    <div className="summary-item">
                      <span>Duration:</span>
                      <span>{selectedDuration} minutes</span>
                    </div>
                    <div className="summary-item">
                      <span>Price:</span>
                      <span>
                        $
                        {
                          selectedService.durations?.find(
                            (d) => d.duration === selectedDuration
                          )?.price
                        }
                      </span>
                    </div>
                    {selectedDate && (
                      <div className="summary-item">
                        <span>Date:</span>
                        <span>{selectedDate}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="summary-item">
                        <span>Time:</span>
                        <span>{selectedTime}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeBookingModal}>
                Cancel
              </button>
              <button
                className="book-btn"
                onClick={handleBooking}
                disabled={!selectedDuration || !selectedDate || !selectedTime}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .spa-filters-section {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 10px;
          margin: 40px 0;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .filters-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .clear-filters-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-filters-btn:hover {
          background: #c0392b;
          transform: translateY(-2px);
        }

        .filters-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #34495e;
        }

        .search-input-wrap {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 45px 12px 15px;
          border: 2px solid #ddd;
          border-radius: 25px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #c4a676;
          outline: none;
          box-shadow: 0 0 0 3px rgba(196, 166, 118, 0.1);
        }

        .search-input-wrap i {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        .filter-select {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          border-color: #c4a676;
          outline: none;
          box-shadow: 0 0 0 3px rgba(196, 166, 118, 0.1);
        }

        .results-info {
          color: #7f8c8d;
          font-size: 14px;
          text-align: center;
        }

        .spa-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 30px;
          margin: 40px 0;
        }

        .spa-service-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s ease;
          position: relative;
        }

        .spa-service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .service-card-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .service-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .spa-service-card:hover .service-card-image img {
          transform: scale(1.1);
        }

        .service-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .popular-badge {
          background: #e74c3c;
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.available {
          background: #c4a676;
          color: white;
        }

        .status-badge.limited {
          background: #f39c12;
          color: white;
        }

        .service-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .spa-service-card:hover .service-overlay {
          opacity: 1;
        }

        .quick-book-btn {
          background: #c4a676;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quick-book-btn:hover {
          background: #b39660;
          transform: translateY(-2px);
        }

        .service-card-content {
          padding: 25px;
        }

        .service-category {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #c4a676;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .service-title {
          margin: 10px 0 15px;
          font-size: 20px;
          font-weight: 700;
        }

        .service-title a {
          color: #2c3e50;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .service-title a:hover {
          color: #c4a676;
        }

        .service-description {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .service-specialist {
          margin-bottom: 20px;
        }

        .specialist-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .specialist-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ecf0f1;
        }

        .specialist-name {
          display: block;
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .specialist-label {
          display: block;
          color: #7f8c8d;
          font-size: 12px;
        }

        .service-features {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #7f8c8d;
          font-size: 13px;
        }

        .feature i {
          color: #c4a676;
        }

        .service-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #ecf0f1;
          padding-top: 20px;
        }

        .service-price {
          display: flex;
          flex-direction: column;
        }

        .price-from {
          font-size: 12px;
          color: #7f8c8d;
        }

        .price-amount {
          font-size: 24px;
          font-weight: 700;
          color: #c4a676;
        }

        .loading-indicator {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #ecf0f1;
          border-top: 3px solid #c4a676;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .no-services-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
        }

        .no-services-message i {
          font-size: 48px;
          margin-bottom: 20px;
          color: #bdc3c7;
        }

        .no-services-message h3 {
          margin: 20px 0 10px;
          color: #2c3e50;
        }

        /* Booking Modal Styles */
        .booking-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .booking-modal {
          background: white;
          border-radius: 15px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          border-bottom: 1px solid #ecf0f1;
        }

        .modal-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: #7f8c8d;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #ecf0f1;
          color: #2c3e50;
        }

        .modal-body {
          padding: 30px;
        }

        .service-info {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .service-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
        }

        .service-details h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
        }

        .service-category,
        .service-specialist {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 5px 0;
          color: #7f8c8d;
          font-size: 14px;
        }

        .service-category i,
        .service-specialist i {
          color: #c4a676;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #2c3e50;
        }

        .duration-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .duration-option {
          border: 2px solid #ecf0f1;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .duration-option:hover {
          border-color: #c4a676;
        }

        .duration-option.selected {
          border-color: #c4a676;
          background: #c4a676;
          color: white;
        }

        .duration-time {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .duration-price {
          font-size: 14px;
          opacity: 0.9;
        }

        .date-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .date-input:focus {
          border-color: #c4a676;
          outline: none;
          box-shadow: 0 0 0 3px rgba(196, 166, 118, 0.1);
        }

        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
          max-height: 200px;
          overflow-y: auto;
        }

        .time-slot {
          padding: 10px;
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .time-slot:hover {
          border-color: #c4a676;
        }

        .time-slot.selected {
          border-color: #c4a676;
          background: #c4a676;
          color: white;
        }

        .booking-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
        }

        .booking-summary h4 {
          margin: 0 0 15px 0;
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ecf0f1;
        }

        .summary-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .summary-item span:first-child {
          color: #7f8c8d;
          font-weight: 500;
        }

        .summary-item span:last-child {
          color: #2c3e50;
          font-weight: 600;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 25px 30px;
          border-top: 1px solid #ecf0f1;
        }

        .cancel-btn,
        .book-btn {
          padding: 12px 25px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          flex: 1;
        }

        .cancel-btn {
          background: #ecf0f1;
          color: #7f8c8d;
        }

        .cancel-btn:hover {
          background: #bdc3c7;
          color: #2c3e50;
        }

        .book-btn {
          background: #c4a676;
          color: white;
        }

        .book-btn:hover:not(:disabled) {
          background: #b39660;
          transform: translateY(-2px);
        }

        .book-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .filters-row {
            grid-template-columns: 1fr;
          }

          .spa-services-grid {
            grid-template-columns: 1fr;
          }

          .filters-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .service-features {
            justify-content: center;
          }

          .service-card-footer {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .booking-modal {
            margin: 10px;
            max-width: calc(100% - 20px);
          }

          .service-info {
            flex-direction: column;
            text-align: center;
          }

          .service-image {
            align-self: center;
          }

          .duration-options {
            grid-template-columns: 1fr 1fr;
          }

          .time-slots {
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          }

          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default Spa;
