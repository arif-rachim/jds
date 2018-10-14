import React from 'react';

class PreviewImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.file = props.file;
        this.state.fileName = props.fileName;
        this.state.progress = props.progress || 0;
        const reader = new FileReader();
        reader.onload = this.onLoad.bind(this);
        reader.readAsDataURL(this.state.file);
    }

    static defaultProps = {
        onUploadComplete : () => {}
    };

    onLoad(e) {
        this.setState({
            fileSrc: e.target.result
        });
    }

    dataURLToBlob(dataURL) {
        const BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            const parts = dataURL.split(',');
            const contentType = parts[0].split(':')[1];
            const raw = parts[1];
            return new Blob([raw], {type: contentType});
        }
        const parts = dataURL.split(BASE64_MARKER);
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }

    set progress(val) {
        this.setState({progress: val});
        if(val == 1){
            this.props.onUploadComplete.call(null,this.state.fileName);
        }
    }

    async compressImage() {
        return new Promise(resolve => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const max_size = 544;
                let width = image.width;
                let height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                const resizedImage = this.dataURLToBlob(dataUrl);
                resolve(resizedImage);
            };
            image.src = this.state.fileSrc;
        });
    }

    async uploadFile() {
        const compressedImage = await this.compressImage();
        const formData = new FormData();
        const request = new XMLHttpRequest();
        formData.set('photo', compressedImage);
        request.open('POST', `/upload?file=${this.state.fileName}`);
        const self = this;
        request.addEventListener('progress', event => {
            if (event.lengthComputable) {
                self.progress = event.loaded / event.total;
            }
        }, false);
        request.send(formData);
    }

    render() {
        const printButton = () => {
            return (
            <div style={{position:'absolute',top:'0',left : '0',right:'0',bottom:'0',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                {this.state.progress == 0 ? <button onClick={this.uploadFile.bind(this)} className={'btn btn-primary'}>Upload</button> : ``}
            </div>);
        };
        return <div style={{width: '100%',position:'relative'}}>
            <img src={this.state.fileSrc} style={{
                width: '100%',
                opacity: (0.5 + (this.state.progress)),
                transition: 'all 1s ease-out',
                margin: '0px'
            }}/>
            {printButton()}
        </div>
    }
}

export default PreviewImage;