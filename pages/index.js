import QuestionerCard from './QuestionerCard';
import UploadImage from './UploadImage';
import Geolocation from './Geolocation';
export default () => {
    return <div>
        <Geolocation></Geolocation>
        <UploadImage></UploadImage>
        <QuestionerCard/>
    </div>
}