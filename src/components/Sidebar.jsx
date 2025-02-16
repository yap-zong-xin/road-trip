import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <AppNav />

            {/* display the contents of the nested routes in App.jsx */}
            {/* similar to children prop but for routes */}
            <Outlet />

            <Footer />
        </div>
    );
}

export default Sidebar;
