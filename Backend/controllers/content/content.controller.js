import {
    HomePage,
    RoomsPage,
    SpaPage,
    RestaurantPage,
    EventsPage,
    MeetingHallPage,
    Navigation,
    Footer,
    AboutPage
} from '../../models/content/content.model.js';
import path from 'path';
import fs from 'fs';

// Define upload directory path
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'content');

// Get all content
export const getAllContent = async (req, res) => {
    try {
        console.log('===== GET ALL CONTENT =====');

        // Get content from all collections using findOrCreateDocument to ensure they exist
        const [homePage, roomsPage, spaPage, restaurantPage, eventsPage, meetingHallPage, navigation, footer] = await Promise.all([
            findOrCreateDocument(HomePage, 'getAllContent-HomePage'),
            findOrCreateDocument(RoomsPage, 'getAllContent-RoomsPage'),
            findOrCreateDocument(SpaPage, 'getAllContent-SpaPage'),
            findOrCreateDocument(RestaurantPage, 'getAllContent-RestaurantPage'),
            findOrCreateDocument(EventsPage, 'getAllContent-EventsPage'),
            findOrCreateDocument(MeetingHallPage, 'getAllContent-MeetingHallPage'),
            findOrCreateDocument(Navigation, 'getAllContent-Navigation'),
            findOrCreateDocument(Footer, 'getAllContent-Footer')
        ]);

        // Combine all content into a single response
        const combinedContent = {
            homePage,
            roomsPage,
            spaPage,
            restaurantPage,
            eventsPage,
            meetingHallPage,
            navigation,
            footer,
            lastUpdated: new Date(Math.max(
                homePage.lastUpdated || 0,
                roomsPage.lastUpdated || 0,
                spaPage.lastUpdated || 0,
                restaurantPage.lastUpdated || 0,
                eventsPage.lastUpdated || 0,
                meetingHallPage.lastUpdated || 0,
                navigation.lastUpdated || 0,
                footer.lastUpdated || 0
            ))
        };

        res.status(200).json({
            success: true,
            data: combinedContent
        });
    } catch (error) {
        console.error('ERROR in getAllContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch content",
            error: error.message
        });
    }
};

// Home Page Content
export const getHomePageContent = async (req, res) => {
    try {
        console.log('===== GET HOME CONTENT =====');
        const homeContent = await findOrCreateDocument(HomePage, 'getHomeContent');

        res.status(200).json({
            success: true,
            data: homeContent
        });
    } catch (error) {
        console.error('ERROR in getHomeContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get home content",
            error: error.message
        });
    }
};

export const updateHomePageContent = async (req, res) => {
    try {
        console.log('===== UPDATE HOME CONTENT =====');
        console.log('Request body:', req.body);

        let homeContent = await findOrCreateDocument(HomePage, 'updateHomeContent');

        const updatedContent = await safelyUpdateDocument(
            HomePage,
            homeContent._id,
            req.body,
            'updateHomeContent'
        );

        res.status(200).json({
            success: true,
            message: 'Home content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateHomeContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update home content",
            error: error.message
        });
    }
};

// Rooms Page Content
export const getRoomsPageContent = async (req, res) => {
    try {
        console.log('===== GET ROOMS CONTENT =====');
        const roomsContent = await findOrCreateDocument(RoomsPage, 'getRoomsContent');
        
        console.log('Rooms content retrieved from DB:', JSON.stringify(roomsContent, null, 2));

        res.status(200).json({
            success: true,
            data: roomsContent
        });
    } catch (error) {
        console.error('ERROR in getRoomsContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get rooms content",
            error: error.message
        });
    }
};

export const updateRoomsPageContent = async (req, res) => {
    try {
        console.log('===== UPDATE ROOMS CONTENT =====');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        let roomsContent = await findOrCreateDocument(RoomsPage, 'updateRoomsContent');
        console.log('Existing rooms content before update:', JSON.stringify(roomsContent, null, 2));

        // Transform the data structure to match the schema
        let updateData = { ...req.body };
        
        // If frontend sends header structure, flatten it to match schema
        if (updateData.header) {
            if (updateData.header.title) {
                updateData.title = updateData.header.title;
            }
            if (updateData.header.description) {
                updateData.description = updateData.header.description;
            }
            if (updateData.header.coverImage) {
                updateData.coverImage = updateData.header.coverImage;
            }
            // Remove the header object since schema doesn't expect it
            delete updateData.header;
            console.log('Transformed header structure to flat structure');
        }
        
        console.log('Processed update data:', JSON.stringify(updateData, null, 2));

        const updatedContent = await safelyUpdateDocument(
            RoomsPage,
            roomsContent._id,
            updateData,
            'updateRoomsContent'
        );
        
        console.log('Updated rooms content after save:', JSON.stringify(updatedContent, null, 2));

        res.status(200).json({
            success: true,
            message: 'Rooms content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateRoomsContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update rooms content",
            error: error.message
        });
    }
};

// Spa Page Content
export const getSpaPageContent = async (req, res) => {
    try {
        console.log('===== GET SPA CONTENT =====');
        const spaContent = await findOrCreateDocument(SpaPage, 'getSpaContent');

        res.status(200).json({
            success: true,
            data: spaContent
        });
    } catch (error) {
        console.error('ERROR in getSpaContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get spa content",
            error: error.message
        });
    }
};

export const updateSpaPageContent = async (req, res) => {
    try {
        console.log('===== UPDATE SPA CONTENT =====');
        console.log('Request body:', req.body);

        let spaContent = await findOrCreateDocument(SpaPage, 'updateSpaContent');

        const updatedContent = await safelyUpdateDocument(
            SpaPage,
            spaContent._id,
            req.body,
            'updateSpaContent'
        );

        res.status(200).json({
            success: true,
            message: 'Spa content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateSpaContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update spa content",
            error: error.message
        });
    }
};

// Restaurant Page Content
export const getRestaurantPageContent = async (req, res) => {
    try {
        console.log('===== GET RESTAURANT CONTENT =====');
        const restaurantContent = await findOrCreateDocument(RestaurantPage, 'getRestaurantContent');

        res.status(200).json({
            success: true,
            data: restaurantContent
        });
    } catch (error) {
        console.error('ERROR in getRestaurantContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get restaurant content",
            error: error.message
        });
    }
};

export const updateRestaurantPageContent = async (req, res) => {
    try {
        console.log('===== UPDATE RESTAURANT CONTENT =====');
        console.log('Request body:', req.body);

        let restaurantContent = await findOrCreateDocument(RestaurantPage, 'updateRestaurantContent');

        const updatedContent = await safelyUpdateDocument(
            RestaurantPage,
            restaurantContent._id,
            req.body,
            'updateRestaurantContent'
        );

        res.status(200).json({
            success: true,
            message: 'Restaurant content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateRestaurantContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update restaurant content",
            error: error.message
        });
    }
};

// Events Page Content
export const getEventsPageContent = async (req, res) => {
    try {
        console.log('===== GET EVENTS CONTENT =====');
        const eventsContent = await findOrCreateDocument(EventsPage, 'getEventsContent');

        res.status(200).json({
            success: true,
            data: eventsContent
        });
    } catch (error) {
        console.error('ERROR in getEventsContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get events content",
            error: error.message
        });
    }
};

export const updateEventsPageContent = async (req, res) => {
    try {
        console.log('===== UPDATE EVENTS CONTENT =====');
        console.log('Request body:', req.body);

        let eventsContent = await findOrCreateDocument(EventsPage, 'updateEventsContent');

        const updatedContent = await safelyUpdateDocument(
            EventsPage,
            eventsContent._id,
            req.body,
            'updateEventsContent'
        );

        res.status(200).json({
            success: true,
            message: 'Events content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateEventsContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update events content",
            error: error.message
        });
    }
};

// Meeting Hall Page Content
export const getMeetingHallPageContent = async (req, res) => {
    try {
        console.log('===== GET MEETING HALL CONTENT =====');
        const meetingHallContent = await findOrCreateDocument(MeetingHallPage, 'getMeetingHallContent');

        res.status(200).json({
            success: true,
            data: meetingHallContent
        });
    } catch (error) {
        console.error('ERROR in getMeetingHallContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get meeting hall content",
            error: error.message
        });
    }
};

export const updateMeetingHallPageContent = async (req, res) => {
    try {
        console.log('===== UPDATE MEETING HALL CONTENT =====');
        console.log('Request body:', req.body);

        let meetingHallContent = await findOrCreateDocument(MeetingHallPage, 'updateMeetingHallContent');

        const updatedContent = await safelyUpdateDocument(
            MeetingHallPage,
            meetingHallContent._id,
            req.body,
            'updateMeetingHallContent'
        );

        res.status(200).json({
            success: true,
            message: 'Meeting hall content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateMeetingHallContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update meeting hall content",
            error: error.message
        });
    }
};

// Navigation Content
export const getNavigationContent = async (req, res) => {
    try {
        console.log('===== GET NAVIGATION CONTENT =====');
        const navigationContent = await findOrCreateDocument(Navigation, 'getNavigationContent');

        res.status(200).json({
            success: true,
            data: navigationContent
        });
    } catch (error) {
        console.error('ERROR in getNavigationContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get navigation content",
            error: error.message
        });
    }
};

export const updateNavigationContent = async (req, res) => {
    try {
        console.log('===== UPDATE NAVIGATION CONTENT =====');
        console.log('Request body:', req.body);

        let navigationContent = await findOrCreateDocument(Navigation, 'updateNavigationContent');

        const updatedContent = await safelyUpdateDocument(
            Navigation,
            navigationContent._id,
            req.body,
            'updateNavigationContent'
        );

        res.status(200).json({
            success: true,
            message: 'Navigation content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateNavigationContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update navigation content",
            error: error.message
        });
    }
};

// Footer Content
export const getFooterContent = async (req, res) => {
    try {
        console.log('===== GET FOOTER CONTENT =====');
        const footerContent = await findOrCreateDocument(Footer, 'getFooterContent');

        res.status(200).json({
            success: true,
            data: footerContent
        });
    } catch (error) {
        console.error('ERROR in getFooterContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get footer content",
            error: error.message
        });
    }
};

export const updateFooterContent = async (req, res) => {
    try {
        console.log('===== UPDATE FOOTER CONTENT =====');
        console.log('Request body:', req.body);

        let footerContent = await findOrCreateDocument(Footer, 'updateFooterContent');

        const updatedContent = await safelyUpdateDocument(
            Footer,
            footerContent._id,
            req.body,
            'updateFooterContent'
        );

        res.status(200).json({
            success: true,
            message: 'Footer content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateFooterContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update footer content",
            error: error.message
        });
    }
};

// About Page Content
export const getAboutPageContent = async (req, res) => {
    try {
        console.log('===== GET ABOUT CONTENT =====');
        const aboutContent = await findOrCreateDocument(AboutPage, 'getAboutContent');

        res.status(200).json({
            success: true,
            data: aboutContent
        });
    } catch (error) {
        console.error('ERROR in getAboutContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get about content",
            error: error.message
        });
    }
};

export const updateAboutPageContent = async (req, res) => {
    try {
        console.log('===== UPDATE ABOUT CONTENT =====');
        console.log('Request body:', req.body);

        let aboutContent = await findOrCreateDocument(AboutPage, 'updateAboutContent');

        const updatedContent = await safelyUpdateDocument(
            AboutPage,
            aboutContent._id,
            req.body,
            'updateAboutContent'
        );

        res.status(200).json({
            success: true,
            message: 'About content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('ERROR in updateAboutContent:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update about content",
            error: error.message
        });
    }
};

// Upload content image
export const uploadContentImage = async (req, res) => {
    try {
        console.log('===== UPLOAD CONTENT IMAGE =====');

        // Check if file was uploaded
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        console.log('File uploaded:', req.file.filename);

        // Validate file type
        const fileType = req.file.mimetype;
        if (!fileType.startsWith('image/')) {
            // Remove the invalid file
            try {
                const filePath = path.join(uploadsDir, req.file.filename);
                fs.unlinkSync(filePath);
                console.log('Invalid file removed:', filePath);
            } catch (err) {
                console.error('Error removing invalid file:', err);
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Only images are allowed.'
            });
        }

        // Return the file URL with content directory
        const fileUrl = `/uploads/content/${req.file.filename}`;
        console.log('File URL:', fileUrl);

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: fileUrl
            }
        });
    } catch (error) {
        console.error('ERROR in uploadContentImage:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
};

// Helper function to safely create or find a document
const findOrCreateDocument = async (Model, errorContext) => {
    try {
        let document = await Model.findOne();

        if (!document) {
            console.log(`Creating new ${Model.modelName} document`);
            
            // Initialize with proper default values based on model type
            let defaultData = {};
            
            switch (Model.modelName) {
                case 'RoomsPageContent':
                    defaultData = {
                        title: "Luxurious Rooms & Suites",
                        description: "Experience the ultimate in comfort and luxury with our selection of elegantly designed rooms and suites, each offering unique amenities to enhance your stay.",
                        coverImage: "",
                        categories: []
                    };
                    break;
                    
                case 'SpaPageContent':
                    defaultData = {
                        title: "Spa & Wellness",
                        description: "Indulge in a world of relaxation and rejuvenation at our luxury spa. Our treatments combine ancient techniques with modern approaches to provide a truly refreshing experience.",
                        coverImage: "",
                        services: []
                    };
                    break;
                    
                case 'EventsPageContent':
                    defaultData = {
                        title: "Events & Celebrations",
                        description: "Host extraordinary events in our versatile venues, perfect for weddings, conferences, and special celebrations. Our dedicated team ensures every detail is flawlessly executed.",
                        coverImage: "",
                        featuredEvents: []
                    };
                    break;
                    
                case 'MeetingHallPageContent':
                    defaultData = {
                        title: "Meeting Halls & Conference Rooms",
                        description: "Host successful meetings, conferences, and corporate events in our modern, well-equipped meeting halls designed to inspire productivity and collaboration.",
                        coverImage: "",
                        features: []
                    };
                    break;
                    
                case 'RestaurantPageContent':
                    defaultData = {
                        title: "Fine Dining Experience",
                        subtitle: "Enjoy your time in our Hotel with pleasure.",
                        description: "Savor exquisite culinary creations at our restaurant, where our talented chefs craft dishes using the finest local and international ingredients to deliver an unforgettable dining experience.",
                        coverImage: "",
                        menuItemsPDF: "",
                        headChef: "Chef Michael Roberts",
                        cuisineType: "Contemporary International",
                        openingHours: "Breakfast: 6:30 AM - 10:30 AM\nLunch: 12:00 PM - 2:30 PM\nDinner: 6:00 PM - 10:30 PM",
                        featuredDishes: []
                    };
                    break;
                    
                case 'HomePageContent':
                    defaultData = {
                        hero: {
                            title: "Experience Luxury at Parkside Plaza",
                            subtitle: "Indulge in exquisite comfort and world-class amenities",
                            backgroundImage: "",
                            backgroundImage2: "",
                            backgroundImage3: ""
                        },
                        welcome: {
                            message: "Welcome to Parkside Plaza, where luxury meets comfort. Our hotel offers an unforgettable experience with stunning views, exceptional service, and premier amenities. Whether you're visiting for business or leisure, our dedicated staff is committed to making your stay memorable."
                        },
                        about: {
                            content: "Nestled in the heart of the city, Parkside Plaza offers a sanctuary of comfort and luxury. Our hotel features elegantly designed rooms, a renowned spa, exquisite dining options, and versatile event spaces. With our commitment to excellence, we ensure every guest experiences the pinnacle of hospitality."
                        },
                        featuredServices: []
                    };
                    break;
                    
                case 'AboutPageContent':
                    defaultData = {
                        hero: {
                            title: "About The Hotel",
                            subtitle: "Enjoy your time in our Hotel with pleasure.",
                            backgroundImage: ""
                        },
                        about: {
                            title: "About Our Hotel",
                            subtitle: "Enjoy your time in our Hotel",
                            content: "Qed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
                            welcomeMessage: "Fames massa tortor sit nisl sit. Duis nulla tempus quisque et diam condimentum nisl. Rhoncus quisque elementum nulla lorem at turpis vitae quisque. Vulputate duis vel et odio hendrerit magna. Nec lacus dui egestas sit. Vulputate tincidunt viverra viverra etiam porta facilisis."
                        },
                        stats: [],
                        team: [],
                        gallery: []
                    };
                    break;
                    
                case 'NavigationContent':
                    defaultData = {
                        main: [],
                        footer: []
                    };
                    break;
                    
                case 'FooterContent':
                    defaultData = {
                        aboutText: "Parkside Plaza Hotel offers luxury accommodations with world-class amenities and exceptional service in the heart of the city.",
                        contactInfo: {
                            address: "123 Park Avenue, New York, NY 10001",
                            phone: "+1 (555) 123-4567",
                            email: "info@parksideplaza.com"
                        },
                        copyrightText: "© 2025 Parkside Plaza Hotel. All Rights Reserved.",
                        socialMedia: []
                    };
                    break;
                    
                default:
                    // For any other models, use empty object (will rely on schema defaults)
                    defaultData = {};
                    break;
            }
            
            document = await Model.create(defaultData);
            console.log(`New ${Model.modelName} created with proper defaults:`, document._id);
        }

        return document;
    } catch (error) {
        console.error(`ERROR in findOrCreateDocument (${errorContext}):`, error);
        throw new Error(`Failed to find or create ${Model.modelName}: ${error.message}`);
    }
};

// Helper function to safely update a document
const safelyUpdateDocument = async (Model, documentId, updateData, errorContext) => {
    try {
        console.log(`Saving ${Model.modelName} content...`);
        const updatedDoc = await Model.findByIdAndUpdate(
            documentId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            throw new Error(`Document not found after update`);
        }

        console.log(`${Model.modelName} content saved successfully. ID:`, updatedDoc._id);
        return updatedDoc;
    } catch (error) {
        console.error(`ERROR in safelyUpdateDocument (${errorContext}):`, error);
        throw new Error(`Failed to update ${Model.modelName}: ${error.message}`);
    }
}; 