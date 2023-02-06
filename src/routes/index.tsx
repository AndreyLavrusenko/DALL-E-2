import React from "react";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";

export interface IRouter {
    path: string,
    component: JSX.Element,
}

export const enum RoutNames {
    HOME = '/',
    CREATE = '/create-post'
}


export const publicRoutes: IRouter[] = [
    {path: RoutNames.HOME, component: <Home />},
    {path: RoutNames.CREATE, component: <CreatePost />}
]