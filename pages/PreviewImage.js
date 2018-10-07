import React from 'react';

class PreviewImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.file = props.file;
        this.state.progress = props.progress || 0;
        const reader = new FileReader();
        reader.onload = this.onLoad.bind(this);
        reader.readAsDataURL(this.state.file);
    }

    onLoad(e) {
        this.setState({
            fileSrc: e.target.result
        });
    }

    set progress(val) {
        this.setState({progress: val});
    }

    uploadFile() {
        const formData = new FormData();
        const request = new XMLHttpRequest();
        formData.set('photo', this.state.file);
        request.open('POST', '/upload');
        const self = this;
        request.addEventListener('progress', event => {
            if (event.lengthComputable) {
                self.progress = event.loaded / event.total;
            }
        }, false);
        request.send(formData);
    }

    render() {
        return <div style={{display: 'flex', flexDirection: 'column', width: '300px', alignItems: 'center'}}>
            <img src={this.state.fileSrc} style={{
                width: '300px',
                opacity: (0.5 + (this.state.progress)),
                transition: 'all 1s ease-out',
                margin: '5px'
            }}/>
            {this.state.progress == 0 ?
                <button onClick={this.uploadFile.bind(this)}>Upload</button> : `Uploaded ${this.state.progress * 100}%`}
        </div>
    }
}

export default PreviewImage;