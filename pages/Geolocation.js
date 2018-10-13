import React from 'react';

class Geolocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.message = '';
    }

    componentDidMount() {
        this.getLocation();
    }

    updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
        } else {
            this.setState({
                error: 'Geolocation is not supported by this device'
            });
        }
    }

    onUserClickOk(event){
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this),this.getCurrentPositionError.bind(this),{
            enableHighAccuracy: true,
            timeout: 5000
        });
    }

    getCurrentPositionError(err){
        debugger;
    }


    async getLocation() {
        let result = await navigator.permissions.query({
            name: 'geolocation'
        });

        if (result.state == 'granted') {
            this.updateLocation();
        } else if (result.state == 'prompt') {
            this.setState({
                askForPermissionDialog: true
            });
        } else if (result.state == 'denied') {
            // do nothing here
        }
    }

    async showPosition(position, error) {
        if (error) {
            this.showError(error);
            return;
        }
        let latlon = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        const FAKE_KEY = 'AIzaSyC7BWmlj8vccvQTISypp0t49LxutfLglA4';
        const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon.lat},${latlon.lon}&markers=color:red%7Clabel:S%7C${latlon.lat},${latlon.lon}&zoom=15&size=400x300&sensor=false&key=${FAKE_KEY}`;
        const nearestStore = await this.getNearestStore(latlon);

        if(nearestStore && nearestStore.length > 0){
            const store = nearestStore[0];
            this.setState({message : `You are in ${store.store}`});
            this.props.locationFound.call(null,store);
        }else{
            this.setState({message : 'It seems you are not in the located'});
        }
        this.setState({imgUrl});
    }

    async getNearestStore(latlon){
        let response = await fetch(`http://localhost:3000/api/database?c=Store&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let result = await response.json();
        let nearestStore = result.filter(store => {
            const latlonStore = store.latlon.trim().split(',');
            const latStore = parseFloat(latlonStore[0]);
            const lonStore = parseFloat(latlonStore[1]);
            const latGps = parseFloat(latlon.lat);
            const lonGps = parseFloat(latlon.lon);

            const latRatio = latStore < latGps ? (latGps / latStore) : ( latStore/latGps );
            const lonRatio = lonStore < lonGps ? (lonGps / lonStore) : ( lonStore/lonGps );
            return (latRatio > 1 && latRatio < 1.001) && (lonRatio > 1 && lonRatio < 1.001);
        });
        return nearestStore;
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
        const printAskPermissionDialog = () => {
            return (
                <div><h1 >Windy :</h1> <p>Hi, this application require to access your current location, please accept to proceed :)</p>
                    <div style={{marginTop:'20px'}}>
                        <button className={'btn btn-primary'} style={{marginRight:'10px'}} onClick={this.onUserClickOk.bind(this)}>Ok</button>
                        <button className={'btn btn-danger'}>No WAY !</button>
                    </div>
                </div>);
        }
        return <div className="card">
            {this.state.askForPermissionDialog ? printAskPermissionDialog() : ''}
            {this.state.imgUrl ? <img src={this.state.imgUrl} alt="Image address" className="card-img-top"/> : ''}

            <div className="card-body">
                <h5 className="card-title">{this.state.message}</h5>
            </div>
        </div>
    }
}

export default Geolocation;