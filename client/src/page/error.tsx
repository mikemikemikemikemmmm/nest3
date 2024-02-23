
import ErrorImg from '/error.jpg'
export const ErrorPage = () => {
    return <div className="w-screen h-screen flex justify-center items-center">
        <img width={400} height={400} src={ErrorImg} alt="Error" />
    </div>

}