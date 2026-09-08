interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

const Container = ({ children, className='' }:ContainerProps) => {
  return (
    <div className={`p-3 md:p-5 flex flex-col w-full max-w-7xl mx-auto justify-center items-center ${className}`}>
        {children}
    </div>
  )
}

export default Container