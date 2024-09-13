import Comment from "../pages/Comment";
import Profile from "../pages/Profile";
import Profile768 from "../pages/Profile-768";
import NonLogged from "../pages/NonLogged";
import {Navigate} from 'react-router-dom';

var routes = [];
if (window.innerWidth <= 768) {
    routes = [
        {
            path:'/Comment',
            element:<Comment/>
        },
        {
            path:'/Profile',
            element:<Profile768/>
        },
        {
            path:'/',
            element:<Navigate to="Comment"/>
        },
        {
            path: '/NonLogged',
            element:<NonLogged/>
        }
    ];
}
else{
    routes = [
        {
            path:'/Comment',
            element:<Comment/>
        },
        {
            path:'/Profile',
            element:<Profile/>
        },
        {
            path:'/',
            element:<Navigate to="Comment"/>
        },
        {
            path: '/NonLogged',
            element:<NonLogged/>
        }
    ];
}
export default routes;
