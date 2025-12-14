import styles from "../styles/globals.css";
import "antd/dist/reset.css";
import QueryProvider from "../../src/provider/QueryProvider";

const RootLayout = ({ children }) => {
  return (
    <html lang="fa">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
