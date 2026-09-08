import Container from "../elements/Container"

const Header = () => {
  return (
    <section className="w-full min-h-fit shadow-lg group">
        <Container className="py-5">
            <div className="flex flex-col w-full">
                <h1 className="text-txt font-light leading-14 sm:leading-18 tracking-wider text-shadow-md overflow-hidden text-5xl sm:text-6xl text-center transition duration-300 ease-linear group-hover:scale-105">
                    Danas nam je divan dan, našem <span className="font-bold bg-clip-text bg-linear-to-r from-[#f28b82] to-[#ffdb85] text-transparent">Leonishu</span> je rođendan!
                </h1>
                <h2 className="text-center text-3xl my-4 text-shadow-md transition duration-300 ease-linear sm:text-4xl group-hover:scale-95">🎂🎉🎊🥳</h2>

                <p className="py-2 uppercase font-semibold text-txt/35 tracking-[0.3rem] text-center text-sm sm:text-lg transition duration-300 ease-linear group-hover:scale-95">Ponos i dika našega šljivika!</p>
            </div>
        </Container>
    </section>
  )
}

export default Header