import styles from "../styles/globals.css";
import "antd/dist/reset.css";
import UsersPage from "./Users/page";

const RootLayout = ({ children }) => {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
