import { AppProvider } from "./providers";
import { Todos } from "./features/todos/routes";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Todos />
    </AppProvider>
  );
}

export default App;
