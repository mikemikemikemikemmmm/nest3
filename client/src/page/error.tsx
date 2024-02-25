
import { useRouteError } from 'react-router-dom';
import ErrorImg from '/error.jpg'
export const ErrorPage = () => {
    const error = useRouteError();
    console.log(error)
    return <div className="w-screen h-screen flex justify-center items-center">
        <img width={400} height={400} src={ErrorImg} alt="Error" />
    </div>

}