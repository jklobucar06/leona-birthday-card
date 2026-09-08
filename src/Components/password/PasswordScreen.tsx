import { useEffect, useState } from "react";
import Container from "../elements/Container"
import NumericKeypad from "./NumericKeypad";
import PasscodeDots from "./PasscodeDots"

interface PasswordScreenProps {
  onUnlock: () => void;
}

const CORRECT_PASSCODE = "101006";
const PASSCODE_LENGTH = 6;

const PasswordScreen = ({ onUnlock }: PasswordScreenProps) => {
  const [passcode, setPasscode] = useState(() => sessionStorage.getItem("passcode") || "");
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("passcode", passcode);
  }, [passcode])

  const handleDigitClick = (digit: string) => {
      if(passcode.length >= PASSCODE_LENGTH || isChecking) return;

      const nextPasscode = passcode + digit;

      setPasscode(nextPasscode);
      setHasError(false);

      if(nextPasscode.length !== PASSCODE_LENGTH) return;

      setIsChecking(true);

      if(nextPasscode === CORRECT_PASSCODE) {
        sessionStorage.setItem("isUnlocked", "true");
        window.setTimeout(onUnlock, 400);
        sessionStorage.setItem("passcode", "");
        return;
      }

      setHasError(true);

      window.setTimeout(() => {
        setPasscode("");
        setHasError(false);
        setIsChecking(false);
      }, 600);
  };

  const handleDelete = () => {
    if(isChecking) return;

    setPasscode(p => p.slice(0, -1));
    setHasError(false);
  };

  return (
    <section className="bg-linear-to-b from-primary from-60% to-secondary min-h-screen flex items-center justify-center overflow-hidden relative">
        <Container>
          <div className={`bg-gray-400/20 p-5 w-full max-w-sm flex flex-col rounded-3xl items-center justify-center ${hasError ? "animate-[shake_0.35s_ease-in-out]": ""}`}>
            <h1 className="font-light text-txt text-xl mb-3 sm:text-2xl">Unesi lozinku 🔐</h1>
            <PasscodeDots enteredDigits={passcode.length} hasError={hasError}/>
            <NumericKeypad onDigitClick={handleDigitClick} onDelete={handleDelete} disabled={isChecking}/>
          </div>
        </Container>
    </section>
  )
}

export default PasswordScreen