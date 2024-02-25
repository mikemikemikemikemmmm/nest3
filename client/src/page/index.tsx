import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import carouselImg0 from "../assets/indexPage/carousel/0.jpg"
import carouselImg1 from "../assets/indexPage/carousel/1.jpg"
import carouselImg2 from "../assets/indexPage/carousel/2.jpg"
import carouselImg3 from "../assets/indexPage/carousel/3.jpg"
import commentImg1 from "../assets/indexPage/comment1.gif"
import commentImg2 from "../assets/indexPage/comment2.gif"
import commentImg3 from "../assets/indexPage/comment3.gif"
import commentImg4 from "../assets/indexPage/comment4.gif"
import commentImg5 from "../assets/indexPage/comment5.gif"
import streamImg1 from "../assets/indexPage/stream1.jpg"
import streamImg2 from "../assets/indexPage/stream2.jpg"
import streamImg3 from "../assets/indexPage/stream3.jpg"
import streamImg4 from "../assets/indexPage/stream4.jpg"
export const IndexPage = () => {
    return (
        <>
            <Carousel className="mb-5" infiniteLoop={true} showStatus={false} showThumbs={false}>
                <img className="w-full" src={carouselImg0} />
                <img className="w-full" src={carouselImg1} />
                <img className="w-full" src={carouselImg2} />
                <img className="w-full" src={carouselImg3} />
            </Carousel>
            <div className="mb-5" >
                <span className="inline-block w-1/5">
                    <img className="h-16" src={commentImg1} />
                </span>
                <span className="inline-block w-1/5">
                    <img className="h-16" src={commentImg2} />
                </span>
                <span className="inline-block w-1/5">
                    <img className="h-16" src={commentImg3} />
                </span>
                <span className="inline-block w-1/5">
                    <img className="h-16" src={commentImg4} />
                </span>
                <span className="inline-block w-1/5 ">
                    <img className="h-16" src={commentImg5} />
                </span>
            </div>
            <div className="mb-5" >
                <span className="inline-block w-1/2 pr-3">
                    <div className="py-3">
                        <img className="w-full" src={streamImg1} />
                    </div>
                    <div className="py-3">
                        <img className="w-full" src={streamImg2} />
                    </div>
                </span>
                <span className="inline-block w-1/2 pl-3">
                    <div className="py-3">
                        <img className="w-full" src={streamImg3} />
                    </div>
                    <div className="py-3">
                        <img className="w-full" src={streamImg4} />
                    </div>
                </span>
            </div>
        </>
    )
}

