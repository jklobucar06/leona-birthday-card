interface NumericKeypadProps {
    onDigitClick: (digit: string) => void;
    onDelete: () => void;
    disabled?: boolean;
}

const digits: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const NumericKeypad = ({ onDigitClick, onDelete, disabled = false}: NumericKeypadProps) => {
    const buttonClasses = "size-16 rounded-full bg-white/45 text-xl font-medium text-txt shadow-sm backdrop-blur-sm transition duration-200 hover:scale-102 hover:bg-white/65 cursor-pointer active:scale-98 disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="flex flex-col relative items-center justify-center mt-7">
        <div className="grid grid-cols-3 gap-4">
        {digits.map(digit => (
            <button key={digit} className={buttonClasses} onClick={() => onDigitClick(digit)} disabled={disabled}>
                {digit}
            </button>
        ))}
        </div>

        <button type="button" className={`${buttonClasses} mt-4`} onClick={() => onDigitClick("0")} disabled={disabled}>
            0
        </button>

        <div className="mt-4 mb-2 justify-end flex w-full">
            <button type="button" className="text-txt font-medium cursor-pointer bg-transparent hover:text-red-800 hover:scale-102 active:scale-98 active:text-txt" onClick={onDelete} disabled={disabled}>
            Delete
        </button>
        </div>
    </div>
  )
}

export default NumericKeypad