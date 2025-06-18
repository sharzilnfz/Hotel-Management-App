import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/White Black Minimalist Mockup Paper Bag Coffee Instagram Post_20241222_202950_0000.png';
import { ContentContext } from '../contexts/ContentContext';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  // Get navigation content from ContentContext
  const { navigationContent, footerContent, loading } =
    useContext(ContentContext);

  // Check if current page is login or signup
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <>
      {/* loader */}
      <div className="loader-wrap">
        <div className="loader-item">
          <div className="cd-loader-layer" data-frame="25">
            <div className="loader-layer"></div>
          </div>
          <span className="loader">
            <i className="fa-thin fa-gem"></i>
          </span>
        </div>
      </div>
      {/* loader end */}

      {/* header */}
      <header className="main-header">
        <div className="container">
          {/* header-top - Hide on auth pages */}
          {!isAuthPage && (
            <div className="header-top fl-wrap">
              <div className="header-top_contacts">
                {footerContent?.contactInfo ? (
                  <>
                    <a href={`tel:${footerContent.contactInfo.phone}`}>
                      <span>Call:</span> {footerContent.contactInfo.phone}
                    </a>
                    <a href="#">
                      <span>Find us:</span> {footerContent.contactInfo.address}
                    </a>
                  </>
                ) : (
                  <>
                    <a href="#">
                      <span>Call:</span> +489756412322
                    </a>
                    <a href="#">
                      <span>Find us:</span> USA 27TH Brooklyn NY
                    </a>
                  </>
                )}
              </div>
              <div className="header-social">
                <ul>
                  {footerContent?.socialMedia ? (
                    footerContent.socialMedia.map((social, index) => (
                      <li key={index}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i
                            className={
                              social.icon ||
                              getDefaultSocialIcon(social.platform)
                            }
                          ></i>
                        </a>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa-brands fa-x-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa-brands fa-tiktok"></i>
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="booking-reviews">
                <div className="br-counter">
                  <div className="ribbon"></div>
                  <span>6.0</span>
                </div>
                <a href="#" target="_blank" className="br_link">
                  <div className="star-rating" data-starrating="5">
                    {' '}
                  </div>
                  <p>Our ratings on Booking.com</p>
                </a>
              </div>
              <div className="lang-wrap">
                <a href="#" className="act-lang">
                  En
                </a>
                <span>/</span>
                <a href="#">Fr</a>
              </div>
            </div>
          )}
          {/* header-top end */}
          <div className="nav-holder-wrap init-fix-header fl-wrap">
            <Link to="/" className="logo-holder">
              <img src={logo} alt="Parkside Hotel" />
            </Link>
            {/* navigation */}
            <div
              className={`nav-holder main-menu ${
                isNavOpen ? 'nav-holder-show' : ''
              }`}
            >
              <nav>
                <ul>
                  {navigationContent && navigationContent.main ? (
                    // Render dynamic navigation items plus our custom items
                    <>
                      {navigationContent.main
                        .filter(
                          (item) =>
                            !item.path.includes('/blog') &&
                            !item.path.includes('/news') &&
                            item.label.toLowerCase() !== 'news' &&
                            item.label.toLowerCase() !== 'blog'
                        )
                        .sort((a, b) => a.order - b.order)
                        .map((item, index) => (
                          <li key={index}>
                            <Link to={item.path}>{item.label}</Link>
                          </li>
                        ))}
                    </>
                  ) : (
                    // Fallback static navigation
                    <>
                      <li>
                        <Link to="/" className="act-link">
                          Home <i className="fas fa-caret-down"></i>
                        </Link>
                        {/* second level */}
                        <ul>
                          <li>
                            <Link to="/">Style 1</Link>
                          </li>
                          <li>
                            <Link to="/">Style 2</Link>
                          </li>
                          <li>
                            <Link to="/">Style 3</Link>
                          </li>
                          <li>
                            <Link to="/">One Page</Link>
                          </li>
                          <li>
                            <Link to="/coming-soon">Coming Soon</Link>
                          </li>
                        </ul>
                        {/* second level end */}
                      </li>
                      <li>
                        <Link to="/about">About</Link>
                      </li>
                      <li>
                        <Link to="/rooms">
                          Rooms<i className="fas fa-caret-down"></i>
                        </Link>
                        {/* second level */}
                        <ul>
                          <li>
                            <Link to="/rooms">Rooms 1</Link>
                          </li>
                          <li>
                            <Link to="/rooms2">Rooms 2</Link>
                          </li>
                          <li>
                            <Link to="/rooms3">Rooms 3</Link>
                          </li>
                          <li>
                            <Link to="/rooms4">Rooms 4</Link>
                          </li>
                          <li>
                            <Link to="/room-single">Room single</Link>
                          </li>
                          <li>
                            <Link to="/room-single2">Room single 2</Link>
                          </li>
                          <li>
                            <Link to="/room-single3">Room single 3</Link>
                          </li>
                        </ul>
                        {/* second level end */}
                      </li>
                      <li>
                        <Link to="/restaurant">Restaurant</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                      <li>
                        <Link to="/contact">Download</Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
            {/* navigation end */}
            <div className="auth-buttons-wrap">
              <Link to="/login" className="serach-header-btn">
                <i className="fa-light fa-user"></i> <span>Login</span>
              </Link>
              <Link to="/signup" className="serach-header-btn signup-btn">
                <i className="fa-light fa-user-plus"></i> <span>Sign Up</span>
              </Link>
            </div>
            {/* nav-button-wrap */}
            <div className="nav-button-wrap" onClick={toggleNav}>
              <div className={`nav-button ${isNavOpen ? 'cmenu' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            {/* nav-button-wrap end */}
          </div>
        </div>
      </header>
      {/* header end */}
    </>
  );
};

// Helper function to get default social media icons
const getDefaultSocialIcon = (platform) => {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case 'facebook':
      return 'fa-brands fa-facebook-f';
    case 'twitter':
    case 'x':
      return 'fa-brands fa-x-twitter';
    case 'instagram':
      return 'fa-brands fa-instagram';
    case 'tiktok':
      return 'fa-brands fa-tiktok';
    case 'linkedin':
      return 'fa-brands fa-linkedin-in';
    case 'youtube':
      return 'fa-brands fa-youtube';
    case 'pinterest':
      return 'fa-brands fa-pinterest-p';
    default:
      return 'fa-brands fa-globe';
  }
};

export default Header;
