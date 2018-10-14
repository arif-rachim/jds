import React from 'react';
import fetch from "isomorphic-fetch";
import db from './LocalDatabase';
import PreviewImage from "./PreviewImage";


const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

class QuestionerCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.store = props.store;
        this.state.categories = props.categories;
        const categories = this.state.categories;
        if (props.questions) {
            this.state.allQuestions = props.questions;
            const _categories = this.state.allQuestions.reduce((res, next) => {
                const questionCategory = categories.filter(cat => cat._id === next.category)[0];
                res[next.category] = res[next.category] || {category: questionCategory, questions: []};
                res[next.category].questions.push(next);
                return res;
            }, {});
            const cleanCategories = [];
            for (const [key, value] of Object.entries(_categories)) {
                cleanCategories.push({
                    category: value.category.category,
                    _id: value.category._id,
                    questions: value.questions
                })
            }
            this.state.catalog = cleanCategories;
        }

    }

    static async getInitialProps(context) {
        let response = await fetch(`http://localhost:3000/api/database?c=Question&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let questions = await response.json();
        response = await fetch(`http://localhost:3000/api/database?c=Category&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let categories = await response.json();
        return {questions, categories}
    }

    async onCategorySelected(category) {
        this.setState({
            selectedCategory: category
        });
    }

    async onQuestionSelected(question) {
        const userAnswer = db.readById(this.state.store._id, question._id);
        this.setState({
            selectedQuestion: question,
            selectedAnswer: userAnswer ? userAnswer.answer : '',
            imageError : false
        });
    }

    async getCategoryFromId(id) {
        return new Promise(resolve => {
            const category = catalog.filter(category => category._id === id)[0];
            resolve(category);
        });
    }

    async getQuestionFromId(id) {
        return new Promise(resolve => {
            const question = this.state.selectedCategory.questions.filter(question => question._id === id)[0];
            resolve(question);
        });
    }

    backToQuestionSelection() {
        this.setState({
            selectedQuestion: null,
            selectedAnswer: null
        });
    }

    uploadPhoto(event){
        const el = document.createElement('input');
        el.setAttribute('type','file');
        el.setAttribute('id','uploadFile');
        el.style.opacity = '0';
        el.addEventListener('change',this.onFileUpload.bind(this));

        document.body.appendChild(el);
        el.click();
    }

    onFileUpload(event){
        const files = Array.from(event.target.files);
        const file = files[0];
        file.id = guid();
        this.setState({fileToUpload: file});
    }

    backToCategorySelection() {
        this.setState({
            selectedCategory: null
        });
    }

    onYesClicked() {
        db.saveOrUpdate(this.state.store._id, this.state.selectedQuestion._id, 'Yes');
        this.setState({});
    }

    onNoClicked() {
        db.saveOrUpdate(this.state.store._id, this.state.selectedQuestion._id, 'No');
        this.setState({});
    }

    onSaveClicked() {
        db.saveOrUpdate(this.state.store._id, this.state.selectedQuestion._id, this.refs.answer.value);
        this.setState({});
    }

    printTypeOfAnswer(typeOfQuestion) {
        switch (typeOfQuestion) {
            case 'boolean' :
                return (
                    <div style={{padding:'1em',background:'rgba(100,100,100,0.1)',borderTop:'1px solid rgba(0,0,0,0.1)'}}>
                        <button className={'btn btn-success'} style={{marginRight: '0.5em'}}
                                onClick={this.onYesClicked.bind(this)}>Yes
                        </button>
                        <button className={'btn btn-danger'} onClick={this.onNoClicked.bind(this)}>No</button>
                    </div>
                )
            case 'text' :
                return (
                    <div style={{background:'rgba(100,100,100,0.1)',borderBottom:'1px solid rgba(0,0,0,0.1)'}}>
                        <textarea name="text" ref={'answer'} cols="30" rows="5"
                                  className="form-control rounded-0"></textarea>
                        <div style={{paddingLeft: '1em',paddingBottom:'1em'}}>
                        <button className={'btn btn-primary'} style={{marginTop: '1em'}}
                                onClick={this.onSaveClicked.bind(this)}>Save
                        </button>
                        </div>
                    </div>
                )
        }
    }

    printSelectedQuestion() {
        const selectedQuestion = this.state.selectedQuestion;
        const selectedAnswer = db.readById(this.state.store._id, selectedQuestion._id);
        return <div>
            <div style={{
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                padding: '0.5em',
                backgroundColor: 'rgba(0,0,0,0.1)',
                display : 'flex'
            }}>
                <button onClick={this.backToQuestionSelection.bind(this)} className={'btn btn-primary'}>Back</button>
                <i style={{flex:'1 1 auto'}}></i>
                <button onClick={this.uploadPhoto.bind(this)} className={'btn btn-success'}><i className="fas fa-camera" style={{fontSize:'1.2em'}}></i></button>
            </div>
            <h3 className={'display-4'} style={{
                fontSize: '3em',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                paddingBottom: '0.5em',
                margin: '0px',
                padding:'0.5em'
            }}>{selectedQuestion.question}</h3>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <h4 className={'display-4'}
                    style={{fontSize: '1.5em', padding: '1em', backgroundColor: 'rgba(100,100,100,0.1)',margin:'0px'}}>Your answer is
                    : "<i>{selectedAnswer ? selectedAnswer.answer.toString() : ''}"</i></h4>
                {this.printTypeOfAnswer(selectedQuestion.type)}
            </div>

        </div>
    }

    printSelectedCategory() {
        return <div>
            <div style={{
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                padding: '0.5em',
                backgroundColor: 'rgba(0,0,0,0.1)'
            }}>
                <button onClick={this.backToCategorySelection.bind(this)} className={'btn btn-primary'}>Back
                </button>
            </div>
            {this.state.selectedCategory.questions.map(question => {
                return (<div key={question._id} onClick={() => this.onQuestionSelected(question)} style={{
                    marginTop: '1rem',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding:'1em'
                }}>
                    <h3 className={'display-4'} style={{fontSize: '2rem', flex: '1 1 auto'}}>{question.question}</h3>
                    {db.readById(this.state.store._id,question._id) !== false ? <i className="fas fa-check-circle" style={{color: 'green',fontSize:'2em',marginLeft:'0.5em'}}></i> : ''}
                </div>)
            })}
        </div>
    }

    printCategories() {
        return <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',padding:'1em',backgroundColor:'rgba(0,0,0,0.1)'}}>
            {this.state.catalog.map(category => {
                return (
                    <div key={category.category} onClick={() => this.onCategorySelected(category)}
                         style={{margin: '0.5em'}}>
                        <button className={'btn btn-primary'}>{category.category}</button>
                    </div>
                );
            })}
        </div>
    }

    onUploadComplete(event){
        const uploadElement = document.getElementById('uploadFile');
        uploadElement.parentNode.removeChild(uploadElement);
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

    render() {
        let displayView = this.state.selectedQuestion ? 'question' : this.state.selectedCategory ? 'category' : 'categories';
        const displayPreviewImage = this.state.fileToUpload !== null && this.state.fileToUpload !== undefined;
        const imageAvailable = this.state.store && this.state.selectedQuestion && !this.state.imageError;
        let today = new Date();
        today = `${today.getDay()}-${today.getMonth()}-${today.getFullYear()}`;

        return (
            <div>
                <div>
                    {displayView == 'question' ? this.printSelectedQuestion() : ''}
                </div>
                <div>
                    {displayView == 'category' ? this.printSelectedCategory() : ''}
                </div>
                <div>
                    {displayView == 'categories' ? this.printCategories() : ''}
                </div>
                <div>
                    {imageAvailable ? <img src={`/static/image/storage/${this.state.store._id}_${this.state.selectedQuestion._id}_${today}.jpeg?${new Date().getTime()}`} style={{width: '100%', margin: '0px'}} onErrorCapture={this.onImageError.bind(this)} /> : ''}
                    {displayPreviewImage ? <PreviewImage file={this.state.fileToUpload} fileName={`${this.state.store._id}_${this.state.selectedQuestion._id}_${today}`} onUploadComplete={this.onUploadComplete.bind(this)}></PreviewImage> : ''}
                </div>
            </div>)
    }
}

export default QuestionerCard;