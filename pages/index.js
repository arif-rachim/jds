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
        let questionCardInitialProps = await QuestionerCard.getInitialProps(context);
        return {questionCardInitialProps}
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
            <div style={{textAlign:'center',marginTop:'1em'}}>
                <a href="#" className="btn btn-primary" onClick={()=> this.onStoreSelected(store)}>Enter Survey {store.store}</a>
            </div>);
    }
    render() {
        const displayEnterSelection = this.state.locationReady && !this.state.displaySurvey;
        const displayQuestionCard = this.state.displaySurvey;
        return <div style={{maxWidth : '430px',margin:'auto'}}>
            <div>
                <Geolocation locationFound={this.onLocationFound.bind(this)}></Geolocation>
            </div>
            <div>
                {displayEnterSelection ? (this.printStore(this.state.store)) : ''}
                {displayQuestionCard ? (<QuestionerCard store={this.state.store} {...this.props.questionCardInitialProps}/>) : ''}
            </div>
        </div>
    }
}

export default Index;