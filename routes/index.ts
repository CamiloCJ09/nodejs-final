import { Express , Request , Response } from "express";
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";
import authServices from "../middleware/auth";

const routes = (app: Express) => {
    //LOGIN
    app.post("/login", userController.login);

    //C
    app.post("/users", authServices.auth,authServices.hasAnyRole("superadmin"),userController.create);
    app.post("/groups", authServices.auth,groupController.create);

    //R
    app.get("/users",authServices.auth ,userController.findAll);
    app.get("/groups", authServices.auth,groupController.findAll);
    app.get("/users/:id",authServices.auth ,userController.findById);
    app.get("/groups/:id", authServices.auth,groupController.findById);

    //U
    app.put("/users/:id",authServices.auth ,userController.update);
    app.put("/groups/:id",authServices.auth ,groupController.update);

    //D
    app.delete("/users/:id",authServices.auth ,userController.delete);
    app.delete("/groups/:id", authServices.auth,groupController.delete);


    //Get all users in a group
    app.get("/users/groups/:groupName",authServices.auth ,userController.getUsersByGroup);

    //Get all groups of a user
    app.get("/groups/users/:userName",authServices.auth ,groupController.getGroupsByUser);


    //Add a user to a group
    app.patch("/groups/add/:id",authServices.auth ,groupController.addMember);

    //Remove a user from a group
    app.put("/groups/remove/:id/user/:userId",authServices.auth ,groupController.removeMember);
    
};

export default routes;