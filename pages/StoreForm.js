import React from 'react';
import fetch from 'isomorphic-fetch';
import ImageField from './ImageField';
const collectionName = 'Store';
class StoreForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.stores = this.props.stores;
    }

    static async getInitialProps() {
        let response = await fetch(`http://localhost:3000/api/database?c=${collectionName}&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let result = await response.json();
        return {
            stores: result
        }
    }

    async onSaveStore(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value
        });
        let response = await fetch(`http://localhost:3000/api/database?c=${collectionName}&a=create`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });
        let result = await response.json();
        if (result.ok) {
            await this.updateStores();
            form.reset();
        }
    }

    async deleteStore(store) {
        const userConfirm = confirm('Are you sure you want to remove store ?');
        if (!userConfirm) {
            return false;
        }
        let response = await fetch(`http://localhost:3000/api/database?c=${collectionName}&a=delete`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(store)
        });
        let result = await response.json();
        this.updateStores();
    }

    async updateStores() {
        let response = await fetch(`http://localhost:3000/api/database?c=${collectionName}&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let result = await response.json();
        this.setState({
            stores: result
        });
    }



    render() {
        return (
            <div className={'container'}>

                <form action="" onSubmit={this.onSaveStore.bind(this)} className={'container card'}>
                    <h3 className={'display-4'}>Store Form</h3>
                    <div className={'form-group'}>
                        <label htmlFor={'store'}>Store Name</label>
                        <input type="text" name={'store'} required className={'form-control'}/>
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor={'store'}>Lattitude Longitude</label>
                        <input type="text" name={'latlon'} required  className="form-control"/>
                    </div>
                    <div className={'form-group'}>
                        <input type="submit" value={'Add'} className="btn btn-primary"/>
                    </div>
                </form>

                <table className={'table table-striped'}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Store</th>
                        <th>Lat Lon</th>
                        <th style={{width:'50px'}}>Store Image</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.stores.map((store, index) => (<tr key={store._id}>
                        <td>{index + 1}</td>
                        <td style={{fontWeight:'bold'}}>{store.store}</td>
                        <td>{store.latlon}</td>
                        <td style={{width:'50px'}}>
                            <ImageField src={`${store.store.toLowerCase().split(' ').join('_')}`}></ImageField>
                        </td>
                        <td>
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.deleteStore(store)
                            }} className={'btn btn-danger'}>Delete
                            </button>
                        </td>
                    </tr>))}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>

            </div>
        );
    }
}

export default StoreForm;