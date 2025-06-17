import Table from "../../models/restaurant/table.model.js";

// Create a new table
export const createTable = async (req, res) => {
    try {
        console.log("=== Create Table Request ===");
        console.log("Request Body:", req.body);

        const { number, capacity } = req.body;

        // Check if table number already exists
        const existingTable = await Table.findOne({ number });
        if (existingTable) {
            const response = {
                success: false,
                message: "A table with this number already exists"
            };
            console.log("=== Create Table Response (Error) ===");
            console.log(response);
            return res.status(400).json(response);
        }

        // Create new table
        const table = new Table({
            number,
            capacity,
            status: "available",
            reservationTime: null,
            customerName: null
        });

        await table.save();

        const response = {
            success: true,
            message: "Table created successfully",
            data: table
        };

        console.log("=== Create Table Response (Success) ===");
        console.log(response);

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating table:", error);
        const response = {
            success: false,
            message: "Error creating table",
            error: error.message
        };
        console.log("=== Create Table Response (Error) ===");
        console.log(response);
        res.status(500).json(response);
    }
};

// Get all tables
export const getAllTables = async (req, res) => {
    try {
        console.log("=== Get All Tables Request ===");

        const tables = await Table.find().sort({ number: 1 });

        const response = {
            success: true,
            count: tables.length,
            data: tables
        };

        console.log("=== Get All Tables Response ===");
        console.log(`Found ${tables.length} tables`);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching tables:", error);
        const response = {
            success: false,
            message: "Failed to fetch tables",
            error: error.message
        };
        console.log("=== Get All Tables Response (Error) ===");
        console.log(response);
        res.status(500).json(response);
    }
};

// Get a single table by ID
export const getTableById = async (req, res) => {
    try {
        console.log("=== Get Table By ID Request ===");
        console.log("Table ID:", req.params.id);

        const table = await Table.findById(req.params.id);
        if (!table) {
            const response = {
                success: false,
                message: "Table not found"
            };
            console.log("=== Get Table By ID Response (Not Found) ===");
            console.log(response);
            return res.status(404).json(response);
        }

        const response = {
            success: true,
            data: table
        };

        console.log("=== Get Table By ID Response (Success) ===");
        console.log(response);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching table:", error);
        const response = {
            success: false,
            message: "Failed to fetch table",
            error: error.message
        };
        console.log("=== Get Table By ID Response (Error) ===");
        console.log(response);
        res.status(500).json(response);
    }
};

// Update table status and customer information
export const updateTableStatus = async (req, res) => {
    try {
        console.log("=== Update Table Status Request ===");
        console.log("Table ID:", req.params.id);
        console.log("Request Body:", req.body);

        const { status, customerName, reservationTime } = req.body;

        // Find the table
        const table = await Table.findById(req.params.id);
        if (!table) {
            const response = {
                success: false,
                message: "Table not found"
            };
            console.log("=== Update Table Status Response (Not Found) ===");
            console.log(response);
            return res.status(404).json(response);
        }

        // Update table status and information
        table.status = status;

        // If status is available, clear customer info
        if (status === "available") {
            table.customerName = null;
            table.reservationTime = null;
        } else {
            // Otherwise update with new info
            table.customerName = customerName || table.customerName;
            table.reservationTime = reservationTime || table.reservationTime;
        }

        await table.save();

        const response = {
            success: true,
            message: "Table status updated successfully",
            data: table
        };

        console.log("=== Update Table Status Response (Success) ===");
        console.log(response);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error updating table status:", error);
        const response = {
            success: false,
            message: "Failed to update table status",
            error: error.message
        };
        console.log("=== Update Table Status Response (Error) ===");
        console.log(response);
        res.status(500).json(response);
    }
};

// Update table details (number, capacity)
export const updateTable = async (req, res) => {
    try {
        console.log("=== Update Table Request ===");
        console.log("Table ID:", req.params.id);
        console.log("Request Body:", req.body);

        const { number, capacity } = req.body;

        // Find the table
        const table = await Table.findById(req.params.id);
        if (!table) {
            const response = {
                success: false,
                message: "Table not found"
            };
            console.log("=== Update Table Response (Not Found) ===");
            console.log(response);
            return res.status(404).json(response);
        }

        // If updating table number, check if it's already taken
        if (number && number !== table.number) {
            const existingTable = await Table.findOne({ number });
            if (existingTable) {
                const response = {
                    success: false,
                    message: "A table with this number already exists"
                };
                console.log("=== Update Table Response (Error) ===");
                console.log(response);
                return res.status(400).json(response);
            }
            table.number = number;
        }

        // Update capacity if provided
        if (capacity) {
            table.capacity = capacity;
        }

        await table.save();

        const response = {
            success: true,
            message: "Table updated successfully",
            data: table
        };

        console.log("=== Update Table Response (Success) ===");
        console.log(response);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error updating table:", error);
        const response = {
            success: false,
            message: "Failed to update table",
            error: error.message
        };
        console.log("=== Update Table Response (Error) ===");
        console.log(response);
        res.status(500).json(response);
    }
};

// Delete a table
export const deleteTable = async (req, res) => {
    try {
        console.log("=== Delete Table Request ===");
        console.log("Table ID:", req.params.id);

        const table = await Table.findById(req.params.id);
        if (!table) {
            const response = {
                success: false,
                message: "Table not found"
            };
            console.log("=== Delete Table Response (Not Found) ===");
            console.log(response);
            return res.status(404).json(response);
        }

        await table.deleteOne();

        const response = {
            success: true,
            message: "Table deleted successfully"
        };

        console.log("=== Delete Table Response (Success) ===");
        console.log(response);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error deleting table:", error);
        const response = {
            success: false,
            message: "Failed to delete table",
            error: error.message
        };
        console.log("=== Delete Table Response (Error) ===");
        console.log(response);
        res.status(500).json(response);
    }
}; 