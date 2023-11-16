import { Express , Request , Response } from "express";
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";
import authServices from "../middleware/auth";

const routes = (app: Express) => {
    app.post("/login", userController.login);

    app.post("/users", authServices.auth,authServices.hasAnyRole("superadmin"),userController.create);
    app.post("/groups", authServices.auth,groupController.create);

    app.get("/users",authServices.auth ,userController.findAll);
    app.get("/groups", authServices.auth,groupController.findAll);
    app.get("/users/:id",authServices.auth ,userController.findById);
    app.get("/groups/:id", authServices.auth,groupController.findById);

    app.put("/users/:id",authServices.auth ,userController.update);
    app.put("/groups/:id",authServices.auth ,groupController.update);

    app.delete("/users/:id",authServices.auth ,userController.delete);
    app.delete("/groups/:id", authServices.auth,groupController.delete);

    app.get("/users/groups/:groupName",authServices.auth ,userController.getUsersByGroup);
    app.get("/groups/users/:userName",authServices.auth ,groupController.getGroupsByUser);


    app.patch("/groups/add/:id",authServices.auth ,groupController.addMember);
    app.put("/groups/remove/:id/user/:userId",authServices.auth ,groupController.removeMember);
    
};

export default routes;