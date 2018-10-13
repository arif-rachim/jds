import React from 'react';
import Geolocation from './Geolocation';
import QuestionerCard from "./QuestionerCard";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.locationReady = false;
        this.state.displaySurvey = false;
    }

    static async getInitialProps(context) {
        return {}
    }

    onLocationFound(store) {
        this.setState({
            locationReady: true,
            store
        });
    }

    onStoreSelected(store){
       this.setState({
           displaySurvey : store !== null && store !== undefined
       });
    }

    printStore(store){
        return (
            <div key={store._id} >
                <a href="#" className="btn btn-primary" onClick={()=> this.onStoreSelected(store)}>Enter Survey {store.store}</a>
            </div>);
    }
    render() {
        const displayEnterSelection = this.state.locationReady && !this.state.displaySurvey;
        const displayQuestionCard = this.state.displaySurvey;
        return <div className={'container'}>
            <div>
                <Geolocation locationFound={this.onLocationFound.bind(this)}></Geolocation>
            </div>
            <div style={{marginTop:'20px'}}>
                {displayEnterSelection ? (this.printStore(this.state.store)) : ''}
                {displayQuestionCard ? (<QuestionerCard store={this.state.store}/>) : ''}
            </div>
        </div>
    }
}

export default Index;