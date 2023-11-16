// Import necessary modules from external dependencies
import { Express, Request, Response } from "express";

// Import controllers and middleware from local files
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";
import authServices from "../middleware/auth";

// Define the routes for the Express app
const routes = (app: Express) => {
    // Authentication endpoint for user login
    app.post("/login", userController.login);

    // Endpoint for creating users with authentication and role-based access control
    app.post("/users", authServices.auth, authServices.hasAnyRole("superadmin"), userController.create);
    
    // Endpoint for creating groups with authentication
    app.post("/groups", authServices.auth, groupController.create);

    // Endpoints for retrieving all users and groups with authentication
    app.get("/users", authServices.auth, userController.findAll);
    app.get("/groups", authServices.auth, groupController.findAll);

    // Endpoints for retrieving a specific user or group by ID with authentication
    app.get("/users/:id", authServices.auth, userController.findById);
    app.get("/groups/:id", authServices.auth, groupController.findById);

    // Endpoints for updating a user or group by ID with authentication
    app.put("/users/:id", authServices.auth, userController.update);
    app.put("/groups/:id", authServices.auth, groupController.update);

    // Endpoints for deleting a user or group by ID with authentication
    app.delete("/users/:id", authServices.auth, userController.delete);
    app.delete("/groups/:id", authServices.auth, groupController.delete);

    // Endpoints for retrieving users by group and groups by user with authentication
    app.get("/users/groups/:groupName", authServices.auth, userController.getUsersByGroup);
    app.get("/groups/users/:userName", authServices.auth, groupController.getGroupsByUser);

    // Endpoints for adding and removing members from a group with authentication
    app.patch("/groups/add/:id", authServices.auth, groupController.addMember);
    app.put("/groups/remove/:id/user/:userId", authServices.auth, groupController.removeMember);
};

// Export the routes for use in other parts of the application
export default routes;
