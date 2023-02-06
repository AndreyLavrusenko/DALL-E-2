import React from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import {publicRoutes, RoutNames} from "../routes";

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map((route, i) => (
                <Route path={route.path} key={i} element={route.component}/>
            ))}
            <Route path='*' element={<Navigate to={RoutNames.HOME} />} />
        </Routes>
    );
};

export default AppRouter;