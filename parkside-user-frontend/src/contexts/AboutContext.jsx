import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AboutContext = createContext();

export const AboutProvider = ({ children }) => {
    const [aboutContent, setAboutContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAboutContent = async () => {
        try {
            setLoading(true);
            const response = await api.get('/content/about');
            if (response.data.success) {
                setAboutContent(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch about content');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch about content');
            console.error('Error fetching about content:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const value = {
        aboutContent,
        loading,
        error,
        fetchAboutContent
    };

    return (
        <AboutContext.Provider value={value}>
            {children}
        </AboutContext.Provider>
    );
};

export default AboutProvider; 