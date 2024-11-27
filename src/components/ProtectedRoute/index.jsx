import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";
import { notification } from "antd";

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.role.name;
    const userActive = user.active;

    if (isAdminRoute && userRole === 'ADMIN' && userActive === true ||
        !isAdminRoute && (userRole === 'USER' || userRole === 'ADMIN') && userActive === true
    ) {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const isActive = useSelector(state => state.account.user.active);
    
    if (isAuthenticated && !isActive) {
        notification.error({
            message: 'Thông báo!',
            description: "Tài khoản của bạn bị hạn chế sử dụng tính năng này!"
        });
        
    }
    return (
        <>
            {isAuthenticated === true ?
                <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>
                </>
                :
                <Navigate to='/login' replace />
            }
        </>
    )
}

export default ProtectedRoute;

