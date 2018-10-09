import React from 'react';

class Geolocation extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
        } else {
            this.setState({
                error: 'Geolocation is not supported by this device'
            });
        }
    }

    showPosition(position, error) {
        if (error) {
            this.showError(error);
            return;
        }
        let latlon = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        const FAKE_KEY = 'AIzaSyC7BWmlj8vccvQTISypp0t49LxutfLglA4B4uT41';
        const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon.lat},${latlon.lon}&markers=color:red%7Clabel:S%7C${latlon.lat},${latlon.lon}&zoom=15&size=400x300&sensor=false&key=${FAKE_KEY}`;

        this.setState({
            latlon,
            imgUrl
        });
    }

    showError(error) {
        let errorMessage = '';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                errorMessage = "An unknown error occurred.";
                break;
        }

        this.setState({
            error: errorMessage
        });

    }

    render() {
        return <div>
            {this.state.imgUrl ? <img src={this.state.imgUrl} alt="Image address"/> : ''}
            {this.state.errorMessage}
        </div>
    }
}

export default Geolocation;