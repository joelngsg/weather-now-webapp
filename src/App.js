import Main from "./pages/Main";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="App" >
        <Main />
      </div>
    </ThemeProvider>
  );
}

export default App;
