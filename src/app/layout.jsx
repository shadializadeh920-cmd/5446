import "../styles/globals.css";
import "antd/dist/reset.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
}
