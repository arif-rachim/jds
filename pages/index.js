import React from 'react';
import QuestionerCard from './QuestionerCard';
import UploadImage from './UploadImage';
import Geolocation from './Geolocation';
import StoreSelection from './StoreSelection';
class Index extends React.Component{
    static async getInitialProps(context){
        let storeSelectionInitProps = await StoreSelection.getInitialProps(context);
        return {
            storeSelectionInitProps
        }
    }
    render(){
        return <div>
            <Geolocation></Geolocation>
            <StoreSelection {...this.props.storeSelectionInitProps}></StoreSelection>
            <UploadImage></UploadImage>
            <QuestionerCard/>
        </div>
    }
}
export default Index;