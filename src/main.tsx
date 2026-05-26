import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

import { Provider } from "react-redux"
import { store } from "@/app/store"
import { ThemeProvider } from "@/components/theme-provider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
)
