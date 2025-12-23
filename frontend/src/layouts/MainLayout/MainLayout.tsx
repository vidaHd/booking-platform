import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import styles from "./MainLayout.module.scss";

const MainLayout = () => {
  return (
    <div className={styles.appLayout}>
      <Header />
      <main className={styles.appContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
