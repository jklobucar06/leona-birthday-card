
interface PasscodeDotsProps {
    enteredDigits: number;
    hasError: boolean;
}

const PASSCODE_LENGTH: number = 6;

const PasscodeDots = ({enteredDigits, hasError}: PasscodeDotsProps) => {
  return (
    <div className="flex gap-3">
        {Array.from({length: PASSCODE_LENGTH}).map((_, index) => {
            const isFilled = index < enteredDigits;

            return (
                <span
                    key={index}
                    className={`size-3 rounded-full border border-txt transition-all duration-200 ${hasError ? "bg-red-700 border-none" : isFilled ? "bg-txt scale-105" : ""}`}
                />
            )
        })}
    </div>
  )
}

export default PasscodeDots