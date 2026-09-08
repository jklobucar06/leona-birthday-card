import { useState } from "react"
import Container from "../elements/Container"
import { reasons } from "../../data/reasons-data";

const LoveReasons = () => {
  const [revealedReasons, setRevealedReasons] = useState<number[]>([]);

  const toggleReason = (reasonIndex: number) => {
    setRevealedReasons(currReasons => {
      const isAlreadyRevealed = currReasons.includes(reasonIndex);

      if(isAlreadyRevealed) return currReasons.filter(index => index !== reasonIndex);
      
      return [...currReasons, reasonIndex];
    })
  };

  
  return (
    <section className="w-full px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <Container>
        <header className="mx-auto mb-12 w-full max-w-2xl sm:mb-16">
          <p className="text-txt/55 uppercase tracking-[0.2rem] ">1000 razloga, a ovo su samo neki...</p>

          <h1 className="mt-3 pb-5 text-6xl font-semibold bg-clip-text text-transparent bg-linear-to-bl from-red-800/10 via-red-800 to-red-800/10">Volim te jer...</h1>
        </header>
        
        <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const isRevealed = revealedReasons.includes(index);

            return (
              <li key={reason.number} className="h-56 w-full perspective-[1000px] sm:h-64 bg-white/65 rounded-4xl shadow-lg transition duration-300 ease-linear hover:bg-white/90 hover:scale-103 active:scale-97" onClick={() => toggleReason(index)}>
                <button className={`relative h-full w-full cursor-pointer transition-transform duration-500 ease-in-out transform-3d motion-reduce:transition-none ${isRevealed ? "rotate-y-180": ""}`}>
                  {/* PREDNJA STRANA KARTICE */}
                  <span className="absolute inset-0 grid place-items-center p-6 backface-hidden text-red-800/80 tracking-widest font-light text-3xl">
                    <span>{reason.number}</span>
                  </span>

                  {/* STRAZNJA STRANA KARTICE */}
                  <span className="absolute inset-0 grid place-items-center overflow-y-auto p-6 backface-hidden rotate-y-180">
                    <span className="text-base leading-relaxed font-handwritten text-red-800/80">
                      {reason.reason}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        
      </Container>
    </section>
  )
}

export default LoveReasons