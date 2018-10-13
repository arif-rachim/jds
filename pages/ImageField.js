import React from 'react';
import PreviewImage from "./PreviewImage";

const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

class ImageField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.src = this.props.src;
        this.state.imageError = true;
    }

    onFileChange(event) {
        const files = Array.from(event.target.files);
        const file = files[0];
        file.id = guid();
        this.setState({fileToUpload: file});
    }

    onUploadComplete(event){
        this.setState({
            fileToUpload : null,
            imageError : false
        });
    }


    onImageError(){
        this.setState({
            imageError : true
        });
    }

    componentDidMount(){
        this.setState({
            imageError : false
        });
    }

    render() {
        const displayPreviewImage = this.state.fileToUpload !== null && this.state.fileToUpload !== undefined;
        const imageAvailable = this.state.src !== null && this.state.src !== undefined && !this.state.imageError;
        return (<div>
            <input type="file" onChange={this.onFileChange.bind(this)}/>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {imageAvailable ? <img src={`/static/image/storage/${this.state.src}.jpeg?${new Date().getTime()}`} style={{width: '200px', margin: '5px'}} onErrorCapture={this.onImageError.bind(this)} /> : ''}
                {displayPreviewImage ? <PreviewImage file={this.state.fileToUpload} fileName={this.state.src} onUploadComplete={this.onUploadComplete.bind(this)}></PreviewImage> : ''}
            </div>
        </div>);
    }

}

export default ImageField;