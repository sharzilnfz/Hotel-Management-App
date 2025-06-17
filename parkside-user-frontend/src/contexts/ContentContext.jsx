import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the content context
export const ContentContext = createContext();

// Create the content provider component
export const ContentProvider = ({ children }) => {
    // State variables for different types of content
    const [homeContent, setHomeContent] = useState(null);
    const [roomsContent, setRoomsContent] = useState(null);
    const [spaContent, setSpaContent] = useState(null);
    const [meetingContent, setMeetingContent] = useState(null);
    const [restaurantContent, setRestaurantContent] = useState(null);
    const [eventsContent, setEventsContent] = useState(null);
    const [navigationContent, setNavigationContent] = useState(null);
    const [footerContent, setFooterContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // API URL
    const API_URL = 'http://localhost:4000/api/content';

    // Function to fetch all content
    const fetchAllContent = async () => {
        if (initialized && homeContent) {
            return; // Avoid refetching if already loaded
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}`);
            if (response.data.success) {
                const { data } = response.data;
                
                // Set each content type to its respective state
                setHomeContent(data.homePage);
                setRoomsContent(data.roomsPage);
                setSpaContent(data.spaPage);
                setRestaurantContent(data.restaurantPage);
                setEventsContent(data.eventsPage);
                setNavigationContent(data.navigation);
                setFooterContent(data.footer);
                setMeetingContent(data.meetingHallPage);
                setInitialized(true);
            } else {
                throw new Error(response.data.message || 'Failed to fetch content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch content');
            console.error('Error fetching content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch home page content
    const fetchHomeContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/home`);
            if (response.data.success) {
                setHomeContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch home content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch home content');
            console.error('Error fetching home content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch rooms page content
    const fetchRoomsContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/rooms`);
            if (response.data.success) {
                setRoomsContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch rooms content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch rooms content');
            console.error('Error fetching rooms content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch spa page content
    const fetchSpaContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/spa`);
            if (response.data.success) {
                setSpaContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch spa content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch spa content');
            console.error('Error fetching spa content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch restaurant page content
    const fetchRestaurantContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/restaurant`);
            if (response.data.success) {
                setRestaurantContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch restaurant content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch restaurant content');
            console.error('Error fetching restaurant content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch events page content
    const fetchEventsContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/events`);
            if (response.data.success) {
                setEventsContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch events content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch events content');
            console.error('Error fetching events content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch meeting page content
    const fetchMeetingContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/meeting-hall`);
            if (response.data.success) {
                setMeetingContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch meeting content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch meeting content');
            console.error('Error fetching meeting content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch navigation content
    const fetchNavigationContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/navigation`);
            if (response.data.success) {
                setNavigationContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch navigation content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch navigation content');
            console.error('Error fetching navigation content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch footer content
    const fetchFooterContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/footer`);
            if (response.data.success) {
                setFooterContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch footer content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch footer content');
            console.error('Error fetching footer content:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all content on initial load
    useEffect(() => {
        fetchAllContent();
    }, []);

    // Prepare context value
    const value = {
        homeContent,
        roomsContent,
        spaContent,
        meetingContent,
        restaurantContent,
        eventsContent,
        navigationContent,
        footerContent,
        loading,
        error,
        initialized,
        fetchAllContent,
        fetchHomeContent,
        fetchRoomsContent,
        fetchSpaContent,
        fetchRestaurantContent,
        fetchEventsContent,
        fetchNavigationContent,
        fetchFooterContent,
        fetchMeetingContent
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};

export default ContentProvider;
