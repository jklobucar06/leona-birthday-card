import { useState } from "react"
import PasswordScreen from "./Components/password/PasswordScreen";
import MainScreen from "./Components/main/MainScreen";

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem("isUnlocked"));

  if(!isUnlocked) {
    return (<PasswordScreen onUnlock={() => setIsUnlocked("true")}/>);
  }

  return (
    <MainScreen/>
  )
  
}

export default App