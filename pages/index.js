import React from 'react';
import QuestionerCard from './QuestionerCard';
import UploadImage from './UploadImage';
import Geolocation from './Geolocation';
import StoreSelection from './StoreSelection';
class Index extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    static async getInitialProps(context){
        let storeSelectionInitProps = await StoreSelection.getInitialProps(context);
        return {
            storeSelectionInitProps
        }
    }

    onStoreSelected(store){
        this.setState({
            selectedStore : store
        });
    }

    render(){
        const selectedStore = this.state.selectedStore;
        const displayGeolocation = true;
        const displayStoreSelection = selectedStore === null || selectedStore === undefined;

        return <div>
            {displayGeolocation ? (<Geolocation></Geolocation>) : ''}
            {displayStoreSelection ? (<StoreSelection onStoreSelected={this.onStoreSelected.bind(this)} {...this.props.storeSelectionInitProps}></StoreSelection>) : (<QuestionerCard store={selectedStore}/>)}
        </div>
    }
}
export default Index;