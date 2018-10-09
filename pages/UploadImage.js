import React from 'react';
import PreviewImage from './PreviewImage';
import fetch from 'isomorphic-fetch';

const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.filesToUpload = [];
    }

    static defaultProps = {
        images : []
    }

    onFileChange(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => file.id = guid());
        this.setState({
            filesToUpload: this.state.filesToUpload.concat(files)
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.state.filesToUpload.forEach(file => this.sendFile(file));
    }

    static async getInitialProps(context) {
        let {req} = context;
        const refer = req.headers.host;
        let result = await fetch(`http://${refer}/api/images`);
        let images = await result.json();

        return {images};
    }

    render() {

        const printFile = (files) => {
            return files.map(file => {
                return <PreviewImage file={file} key={file.id} ref={file.id}></PreviewImage>
            })
        };

        return (
            <div>
                <input type="file" multiple onChange={this.onFileChange.bind(this)}/>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {printFile(this.state.filesToUpload)}
                    {this.props.images.map(file => {
                        return <img src={`/static/image/storage/${file}`} style={{width: '300px', margin: '5px'}} key={file}/>
                    })}
                </div>
            </div>
        );
    }
}

export default UploadImage;