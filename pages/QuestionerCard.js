import React from 'react';
import fetch from "isomorphic-fetch";


class QuestionerCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.state.store = props.store;
        this.state.categories = props.categories;
        const categories = this.state.categories;
        if(props.questions){
            this.state.allQuestions = props.questions.filter(q => q.stores.indexOf(props.store._id) >= 0);
            const _categories = this.state.allQuestions.reduce((res,next) => {
                const questionCategory = categories.filter(cat => cat._id === next.category)[0];
                res[next.category] = res[next.category] || { category : questionCategory, questions :[]};
                res[next.category].questions.push(next);
                return res;
            },{});
            const cleanCategories = [];
            for (const [key, value] of Object.entries(_categories)) {
                cleanCategories.push({
                    category : value.category.category,
                    _id : value.category._id,
                    questions : value.questions
                })
            }
            this.state.catalog = cleanCategories;
        }

    }

    static async getInitialProps(context){
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
        return {questions,categories}
    }

    async onCategorySelected(category) {
        this.setState({
            selectedCategory: category
        });
    }

    async onQuestionSelected(question) {
        this.setState({
            selectedQuestion: question
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
            selectedQuestion: null
        });
    }

    backToCategorySelection() {
        this.setState({
            selectedCategory: null
        });
    }
    onYesClicked(){
        {/*We need to continue here*/}
    }
    onNoClicked(){

    }

    printTypeOfAnswer(typeOfQuestion) {
        debugger;
        switch (typeOfQuestion) {
            case 'boolean' :
                return (
                    <div>
                        <button className={'btn btn-success'} style={{marginRight:'0.5em'}} onClick={this.onYesClicked.bind(this)}>Yes</button>
                        <button className={'btn btn-danger'} onClick={this.onNoClicked.bind(this)}>No</button>
                    </div>
                )
            case 'text' :
                return (
                    <div><textarea name="text" id="" cols="30" rows="10"></textarea>
                        <button>Save</button>
                    </div>
                )
        }
    }

    printSelectedQuestion() {
        const selectedQuestion = this.state.selectedQuestion;
        return <div>
            <button onClick={this.backToQuestionSelection.bind(this)} className={'btn btn-primary'}
                    style={{margin: '1em'}}>Back
            </button>
            <div style={{margin: '1em'}}>
            <h3 className={'display-4'} >{selectedQuestion.question}</h3>
            {this.printTypeOfAnswer(selectedQuestion.type)}
            </div>

        </div>
    }

    printSelectedCategory() {
        return <div>
            <button onClick={this.backToCategorySelection.bind(this)} className={'btn btn-primary'}
                    style={{margin: '1em'}}>Back
            </button>
            {this.state.selectedCategory.questions.map(question => {
                return (<div key={question._id} className={'card'} onClick={() => this.onQuestionSelected(question)}
                             style={{margin: '1em'}}>
                    <div className={'card-body'}>
                        <p>{question.question}</p>
                    </div>
                </div>)
            })}
        </div>
    }

    printCategories() {
        return <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            {this.state.catalog.map(category => {
                return (
                    <div key={category.category} onClick={() => this.onCategorySelected(category)}>
                        <div className={'col-sm '} style={{margin: '1em'}}>
                            <button className={'btn btn-primary'}><h1 className={'display-3'}>{category.category}</h1>
                            </button>
                        </div>
                    </div>
                );
            })}

        </div>
    }

    render() {
        let displayView = this.state.selectedQuestion ? 'question' : this.state.selectedCategory ? 'category' : 'categories'
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
            </div>)
    }
}

export default QuestionerCard;