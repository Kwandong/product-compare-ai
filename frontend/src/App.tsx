import { useEffect, useState } from "react";
import Login from "./pages/Login";
import MainPage from "./pages/main";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved === "true") {
      setIsAuth(true);
    }
  }, []);

  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

  return <MainPage />;
}