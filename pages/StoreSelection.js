import React from 'react';

const catalog = [
    {
        _id: '1',
        name: 'Deira City Center',
        coordinate: '25.634234,52.231223',
        image: 'Deira.jpg'
    },
    {
        _id: '2',
        name: 'Emirates Mall',
        coordinate: '25.634234,52.231223',
        image: 'EmiratesMall.jpg'
    },
    {
        _id: '3',
        name: 'Mirdiff City Center',
        coordinate: '25.634234,52.231223',
        image: 'MirdiffCC.jpg'
    }

];


class StoreSelection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    defaultProps = {
        onStoreSelected : () => {}
    };

    static async getInitialProps() {
        return {
            catalog
        }
    }

    async onStoreSelected(event){
        const storeId = event.target.getAttribute('data-id');
        const store = await this.getStoreById(storeId);
        this.setState({
            selectedStore : store
        });
        const callback = this.props.onStoreSelected || (() => {});
        callback.call(this,store);
    }

    async getStoreById(id) {
        return new Promise(resolve => {
            const store = catalog.filter(store => store._id === id)[0];
            resolve(store);
        });
    }

    render() {
        const classNameForStore = (store) => {
          const classNames = ['store'];
          if(this.state.selectedStore && store._id === this.state.selectedStore._id){
              classNames.push('selected');
          }
          return classNames.join(' ')
        };
        return (
            <div>
                <div >
                    {this.props.catalog.map(store => <div key={store._id} className={classNameForStore(store)} onClick={this.onStoreSelected.bind(this)} data-id={store._id}>{store.name}</div>)}
                </div>
                <style jsx>{`
                .store{
                    padding : 10px;
                    border : 1px solid black;
                }

                .store.selected{
                    background-color : grey
                }
                `}</style>
            </div>);
    }
}

export default StoreSelection;