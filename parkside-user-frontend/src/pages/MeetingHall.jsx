import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/custom-room-equal-height.css';
import { ContentContext } from '../contexts/ContentContext';

const MeetingHall = () => {
  const dateInputRef = useRef(null);
  // Use restaurantContent as fallback for meeting halls since there's no specific meetingContent
  const { loading, error, meetingContent, fetchMeetingContent } =
    useContext(ContentContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingHalls, setMeetingHalls] = useState([]);
  const [hallsLoading, setHallsLoading] = useState(false);
  const [hallsError, setHallsError] = useState(null);
  const hallsPerPage = 6;

  // Fetch meeting halls from API
  const fetchMeetingHalls = async () => {
    setHallsLoading(true);
    setHallsError(null);
    try {
      const response = await fetch(
        'http://localhost:4000/api/meeting-hall/halls'
      );
      const data = await response.json();
      if (data.status === 'success') {
        // Filter only available halls
        const availableHalls = data.data.halls.filter(
          (hall) => hall.status === 'Available'
        );
        setMeetingHalls(availableHalls);
      } else {
        setHallsError('Failed to fetch meeting halls');
      }
    } catch (error) {
      console.error('Error fetching meeting halls:', error);
      setHallsError('Failed to connect to server');
    } finally {
      setHallsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch restaurant content if not already loaded (using as fallback for meeting halls)
    if (!meetingContent) {
      fetchMeetingContent();
    }

    // Fetch meeting halls from API
    fetchMeetingHalls();

    // Initialize the date picker when the component mounts
    if (window.$ && dateInputRef.current) {
      try {
        window.$(dateInputRef.current).datepicker({
          range: true,
          multipleDatesSeparator: ' - ',
          minDate: new Date(),
        });
      } catch (error) {
        console.error('Error initializing datepicker:', error);
      }
    }

    // Set background images
    const bgElements = document.querySelectorAll('[data-bg]');
    bgElements.forEach((element) => {
      const bgImage = element.getAttribute('data-bg');
      element.style.backgroundImage = `url(${bgImage})`;
    });
  }, [meetingContent, fetchMeetingContent]);

  // Calculate pagination
  const indexOfLastHall = currentPage * hallsPerPage;
  const indexOfFirstHall = indexOfLastHall - hallsPerPage;
  const currentHalls = meetingHalls.slice(indexOfFirstHall, indexOfLastHall);
  const totalPages = Math.ceil(meetingHalls.length / hallsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format price helper
  const formatPrice = (price) => `$${price}`;

  return (
    <>
      {/* Hero section */}
      <div className="content-section parallax-section hero-section hidden-section">
        <div
          className="bg par-elem"
          data-bg={
            meetingContent?.coverImage
              ? `http://localhost:4000${meetingContent.coverImage}`
              : `http://localhost:4000/uploads/content/image-1748947475438-981074244.jpeg`
          }
        ></div>
        <div className="overlay"></div>
        <div className="container">
          <div className="section-title">
            <h4>
              {meetingContent?.description ||
                'Professional spaces for your business needs'}
            </h4>
            <h2>
              {meetingContent?.title || 'Meeting Halls & Conference Rooms'}
            </h2>
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
            <span>Meeting Halls</span>
          </div>
        </div>
        {/* Breadcrumbs end */}

        {/* Main section */}
        <div className="content-section">
          <div className="section-dec"></div>
          <div className="container small-container">
            <div className="section-title">
              <h4>Professional Venues</h4>
              <h2>Meeting Halls & Conference Rooms</h2>
              <div className="section-separator">
                <span>
                  <i className="fa-thin fa-gem"></i>
                </span>
              </div>
              <p className="">
                Host your business meetings, conferences, and corporate events
                in our elegant and well-equipped meeting halls. Each space is
                designed to inspire productivity and collaboration.
              </p>
            </div>
            <div className="fw-search-wrap">
              <form className="custom-form" name="searchform">
                <fieldset>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="date-container input-wrap">
                        <label>Date:</label>
                        <input
                          type="text"
                          id="hall_date"
                          name="halldate"
                          ref={dateInputRef}
                          value=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="quantity">
                        <div className="quantity_title">Hours: </div>
                        <div className="quantity-item">
                          <input type="button" value="-" className="minus" />
                          <input
                            type="text"
                            name="quantity"
                            title="Qty"
                            className="qty color-bg"
                            data-min="1"
                            data-max="12"
                            data-step="1"
                            value="2"
                          />
                          <input type="button" value="+" className="plus" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="quantity">
                        <div className="quantity_title">Attendees: </div>
                        <div className="quantity-item">
                          <input type="button" value="-" className="minus" />
                          <input
                            type="text"
                            name="quantity"
                            title="Qty"
                            className="qty color-bg"
                            data-min="5"
                            data-max="100"
                            data-step="5"
                            value="20"
                          />
                          <input type="button" value="+" className="plus" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <button
                        className="searchform-submit"
                        id="searchform-submit"
                      >
                        Book Hall
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
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
                {/* Meeting Halls Grid */}
                <div className="halls-grid">
                  {hallsLoading ? (
                    <div className="loading-indicator">
                      <div className="loading-spinner"></div>
                      <p>Loading meeting halls...</p>
                    </div>
                  ) : hallsError ? (
                    <div className="error-message">
                      <i className="fa-light fa-exclamation-triangle"></i>
                      <h3>Error Loading Meeting Halls</h3>
                      <p>{hallsError}</p>
                      <button onClick={fetchMeetingHalls} className="retry-btn">
                        <i className="fa-light fa-refresh"></i> Try Again
                      </button>
                    </div>
                  ) : meetingHalls.length === 0 ? (
                    <div className="no-halls-message">
                      <i className="fa-light fa-building"></i>
                      <h3>No meeting halls found</h3>
                      <p>All meeting halls are currently unavailable</p>
                    </div>
                  ) : (
                    currentHalls.map((hall) => (
                      <div className="hall-card" key={hall._id}>
                        <div className="hall-card-header">
                          <div className="hall-badge">
                            <span
                              className={`status-badge ${hall.status.toLowerCase()}`}
                            >
                              {hall.status}
                            </span>
                          </div>
                          <div className="hall-icon">
                            <i className="fa-light fa-building-columns"></i>
                          </div>
                        </div>

                        <div className="hall-card-content">
                          <h3 className="hall-title">
                            <Link to={`/meeting-hall/${hall._id}`}>
                              {hall.name}
                            </Link>
                          </h3>

                          <p className="hall-size">
                            <i className="fa-light fa-ruler-combined"></i>
                            {hall.size} sq ft
                          </p>

                          <div className="hall-details">
                            <div className="hall-features">
                              <div className="feature">
                                <i className="fa-light fa-users"></i>
                                <span>Capacity: {hall.capacity} people</span>
                              </div>
                              <div className="feature">
                                <i className="fa-light fa-tag"></i>
                                <span>Per hour pricing</span>
                              </div>
                            </div>
                          </div>

                          {hall.amenities && hall.amenities.length > 0 && (
                            <div className="hall-amenities">
                              <span className="amenities-label">
                                Amenities:
                              </span>
                              <div className="amenities-list">
                                {hall.amenities
                                  .slice(0, 3)
                                  .map((amenity, index) => (
                                    <span key={index} className="amenity-item">
                                      {amenity}
                                    </span>
                                  ))}
                                {hall.amenities.length > 3 && (
                                  <span className="more-amenities">
                                    +{hall.amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="hall-card-footer">
                            <div className="hall-price">
                              <span className="price-amount">
                                {formatPrice(hall.price)}
                              </span>
                              <span className="price-per">per hour</span>
                            </div>

                            <div className="hall-actions">
                              <button
                                className="wishlist-btn"
                                title="Add to Wishlist"
                              >
                                <i className="fa-light fa-heart"></i>
                              </button>
                              <Link
                                to={`/meeting-hall/${hall._id}`}
                                className="view-details-btn"
                              >
                                View Details
                                <i className="fa-light fa-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Meeting Halls Grid end */}
              </div>
            </div>

            {/* Pagination */}
            {!hallsLoading &&
              !hallsError &&
              meetingHalls.length > 0 &&
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

      <style jsx>{`
        .halls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          margin: 40px 0;
        }

        .hall-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.4s ease;
          position: relative;
          border: 1px solid #f1f2f6;
        }

        .hall-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .hall-card-header {
          background: linear-gradient(135deg, #c4a676 0%, #b39660 100%);
          padding: 20px;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hall-badge {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .hall-icon {
          font-size: 36px;
          color: rgba(255, 255, 255, 0.8);
        }

        .hall-card-content {
          padding: 25px;
        }

        .hall-title {
          margin: 0 0 15px;
          font-size: 22px;
          font-weight: 700;
        }

        .hall-title a {
          color: #2c3e50;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .hall-title a:hover {
          color: #c4a676;
        }

        .hall-size {
          color: #c4a676;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hall-features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 25px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #7f8c8d;
          font-size: 14px;
          padding: 8px 0;
        }

        .feature i {
          color: #c4a676;
          width: 18px;
          font-size: 16px;
        }

        .hall-amenities {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .amenities-label {
          display: block;
          font-size: 13px;
          color: #7f8c8d;
          margin-bottom: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .amenity-item {
          background: #c4a676;
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 500;
        }

        .more-amenities {
          background: #95a5a6;
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 500;
        }

        .hall-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #ecf0f1;
          padding-top: 20px;
        }

        .hall-price {
          display: flex;
          flex-direction: column;
        }

        .price-amount {
          font-size: 28px;
          font-weight: 700;
          color: #c4a676;
        }

        .price-per {
          font-size: 13px;
          color: #7f8c8d;
          font-weight: 500;
        }

        .hall-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wishlist-btn {
          background: none;
          border: 2px solid #ecf0f1;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #7f8c8d;
        }

        .wishlist-btn:hover {
          border-color: #e74c3c;
          color: #e74c3c;
        }

        .view-details-btn {
          background: #c4a676;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .view-details-btn:hover {
          background: #b39660;
          transform: translateY(-2px);
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

        .error-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
        }

        .error-message i {
          font-size: 48px;
          margin-bottom: 20px;
          color: #e74c3c;
        }

        .error-message h3 {
          margin: 20px 0 10px;
          color: #2c3e50;
        }

        .retry-btn {
          background: #c4a676;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .retry-btn:hover {
          background: #b39660;
          transform: translateY(-2px);
        }

        .no-halls-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
        }

        .no-halls-message i {
          font-size: 48px;
          margin-bottom: 20px;
          color: #bdc3c7;
        }

        .no-halls-message h3 {
          margin: 20px 0 10px;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .halls-grid {
            grid-template-columns: 1fr;
          }

          .hall-card-footer {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .amenities-list {
            justify-content: center;
          }

          .hall-card-header {
            padding: 15px;
          }

          .hall-icon {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
};

export default MeetingHall;
