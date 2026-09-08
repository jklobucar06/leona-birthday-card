import Header from "./Header"
import InteractiveHeart from "./InteractiveHeart"
import LoveReasons from "./LoveReasons"
import MemoryTimeline from "./MemoryTimeline"
import PolaroidGallery from "./PolaroidGallery"


const MainScreen = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-primary from-65% to-secondary">
        <Header></Header>
        <PolaroidGallery></PolaroidGallery>
        <MemoryTimeline></MemoryTimeline>
        <LoveReasons></LoveReasons>
        <InteractiveHeart></InteractiveHeart>
    </main>
  )
}

export default MainScreen