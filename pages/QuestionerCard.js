import React from 'react';

const catalog = [
    {
        category: 'Flour',
        _id: '1',
        questions: [
            {
                _id: '2',
                question: 'Does the this store has Flour Big?',
                image: 'image-one.jpg',
                type: 'boolean'
            },
            {
                _id: '3',
                question: 'Tell me about the flour size Flour Medium ?',
                image: 'image-two.jpg',
                type: 'text'
            },
            {
                _id: '4',
                question: 'Does the this store has Flour Small ?',
                image: 'image-three.jpg',
                type: 'boolean'
            }
        ]
    },
    {
        category: 'Eggs',
        _id: '5',
        questions: [
            {
                _id: '6',
                question: 'Does the this store has Eggs Big?',
                image: 'image-one.jpg',
                type: 'boolean'
            },
            {
                _id: '7',
                question: 'Tell me about the flour size Eggs Medium ?',
                image: 'image-two.jpg',
                type: 'text'
            },
            {
                _id: '8',
                question: 'Does the this store has Eggs Small ?',
                image: 'image-three.jpg',
                type: 'boolean'
            }
        ]
    },
    {
        category: 'Oats',
        _id: '9',
        questions: [
            {
                _id: '10',
                question: 'Does the this store has Oats Big?',
                image: 'image-one.jpg',
                type: 'boolean'
            },
            {
                _id: '11',
                question: 'Tell me about the flour size Oats Medium ?',
                image: 'image-two.jpg',
                type: 'text'
            },
            {
                _id: '11',
                question: 'Does the this store has Oats Small ?',
                image: 'image-three.jpg',
                type: 'boolean'
            }
        ]
    }
];

class QuestionerCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.store = props.store;
    }

    async onCategorySelected(event) {
        const id = event.target.getAttribute('data-id');
        const category = await this.getCategoryFromId(id);
        this.setState({
            selectedCategory: category
        });
    }

    async onQuestionSelected(event) {
        const id = event.target.getAttribute('data-id');
        const question = await this.getQuestionFromId(id);
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

    printTypeOfAnswer(typeOfQuestion) {
        switch (typeOfQuestion) {
            case 'boolean' :
                return (
                    <div>
                        <button>Yes</button>
                        <button>No</button>
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
        return <div className={'container'}>
            <div>
                <button onClick={this.backToQuestionSelection.bind(this)}>Back</button>
            </div>
            <span>{selectedQuestion.question}</span>
            <img src={selectedQuestion.image} alt={'image of selected question'}></img>
            {this.printTypeOfAnswer(selectedQuestion.type)}
            <style jsx>{`
            .container{
                display: flex;
                flex-direction : column;
            }
            `}</style>
        </div>
    }

    printSelectedCategory() {
        return <div>
            <button onClick={this.backToCategorySelection.bind(this)}>Back</button>
            {this.state.selectedCategory.questions.map(question => {
                return (<div key={question._id} className={'categoryItem'} onClick={this.onQuestionSelected.bind(this)}
                             data-id={question._id}>
                    {question.question}
                </div>)
            })}
            <style jsx>{`
                .categoryItem {
                    padding : 10px;
                    border : 1px solid grey
                }
            `}</style>
        </div>
    }

    printCategories() {
        return <div className={'categoryContainer'}>
            {catalog.map(category => {
                return (
                    <div key={category.category} className={'categoryItem'}
                         onClick={this.onCategorySelected.bind(this)}
                         data-id={category._id}>{category.category}</div>
                );
            })}
            <style jsx>{`
                .categoryItem {
                    padding : 10px;
                    border : 1px solid grey;
                    width : 33%;
                }
                .categoryContainer{
                    display : flex;
                }
                `}</style>
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