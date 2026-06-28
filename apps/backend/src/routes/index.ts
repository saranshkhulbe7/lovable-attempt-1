import { Hono } from "hono";
import { publicRouter } from "./public";
import { externalRouter } from "./external";

export const routes = new Hono();

routes.route("/public", publicRouter);
routes.route("/external", externalRouter);
