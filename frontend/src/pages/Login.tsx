import { useState } from "react";

interface Props {
  onLogin: () => void;
}

const PASSWORD = "1234";

export default function Login({ onLogin }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (input === PASSWORD) {
      localStorage.setItem("auth", "true");
      onLogin();
    } else {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cognote 로그인</h2>

      <input
        type="password"
        placeholder="비밀번호 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        로그인
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};