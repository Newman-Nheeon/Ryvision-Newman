import Nav from "../components/Nav";
import "../styles/globals.css";
export const metadata = {
  title: "Ryvision",
  description: "Product Page",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-slate-900">
        <main className="app">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
