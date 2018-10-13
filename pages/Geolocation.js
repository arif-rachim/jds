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

    onUserClickOk(event) {
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this), this.getCurrentPositionError.bind(this), {
            enableHighAccuracy: true,
            timeout: 5000
        });
    }

    getCurrentPositionError(err) {
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
        this.setState({askForPermissionDialog: false});
        let latlon = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        const FAKE_KEY = 'AIzaSyC7BWmlj8vccvQTISypp0t49LxutfLglA4';
        const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon.lat},${latlon.lon}&markers=color:red%7Clabel:S%7C${latlon.lat},${latlon.lon}&zoom=15&size=400x300&sensor=false&key=${FAKE_KEY}`;
        const {nearestStore,stores} = await this.getNearestStore(latlon);

        if (nearestStore && nearestStore.length > 0) {
            const store = nearestStore[0];
            this.setState({message: `You are in ${store.store}`,storeFound:true});
            this.props.locationFound.call(null, store);

        } else {
            this.setState({message: 'It seems you are not in the Stores',storeFound:false,stores});
        }
        this.setState({imgUrl});
    }

    async getNearestStore(latlon) {
        let response = await fetch(`http://localhost:3000/api/database?c=Store&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let stores = await response.json();
        let nearestStore = stores.filter(store => {
            const latlonStore = store.latlon.trim().split(',');
            const latStore = parseFloat(latlonStore[0]);
            const lonStore = parseFloat(latlonStore[1]);
            const latGps = parseFloat(latlon.lat);
            const lonGps = parseFloat(latlon.lon);

            const latRatio = latStore < latGps ? (latGps / latStore) : (latStore / latGps);
            const lonRatio = lonStore < lonGps ? (lonGps / lonStore) : (lonStore / lonGps);
            return (latRatio > 1 && latRatio < 1.001) && (lonRatio > 1 && lonRatio < 1.001);
        });
        return {nearestStore,stores};
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
    printStores(){
        return this.state.stores ? this.state.stores.map(store => <span key={store._id} className="badge badge-primary" style={{margin:'0.1em'}}>{store.store}</span>) : '';
    }
    render() {
        const printAskPermissionDialog = () => {
            return (
                <div>
                    <h1 className={'display-4'}>Jenan Distribution System</h1> <p>Hi, this application require to access
                    your current location, please accept to proceed </p>
                    <div style={{marginTop: '20px'}}>
                        <button className={'btn btn-primary'} style={{marginRight: '10px'}}
                                onClick={this.onUserClickOk.bind(this)}>Ok
                        </button>
                        <button className={'btn btn-danger'}>No</button>
                    </div>
                </div>);
        };

        const printLocation = () => {
            return <div style={{textAlign:'center'}}>
                {this.state.storeFound ? <h3 className="display-4" style={{fontSize:'2em'}}>{this.state.message}</h3> : <p>It seems you are not in the store, this application will be enabled once you are in the {this.printStores()}</p>}
                {this.state.imgUrl ? <img src={this.state.imgUrl} alt="Image address" className="img-thumbnail"/> : ''}
            </div>;
        }
        return <div>
            {this.state.askForPermissionDialog ? printAskPermissionDialog() : printLocation()}

        </div>
    }
}

export default Geolocation;