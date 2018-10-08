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
    }

    async onCategorySelected(event) {
        const id = event.target.getAttribute('data-id');
        const category = await this.getCategoryFromId(id);
        this.setState({
            selectedCategory: category
        });
    }

    async getCategoryFromId(id) {
        return new Promise(resolve => {
            const category = catalog.filter(category => category._id === id)[0];
            resolve(category);
        });
    }

    backToCategory(){
        this.setState({
            selectedCategory : null
        });
    }

    printSelectedCategory() {
        return <div>
            <button onClick={this.backToCategory.bind(this)}>Back</button>
            {this.state.selectedCategory.questions.map(question => {
                return (<div key={question._id} className={'categoryItem'}>
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
        return <div>
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
                    border : 1px solid grey
                }
                `}</style>
        </div>
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.selectedCategory ? this.printSelectedCategory() : ''}
                </div>
                <div>
                    {this.state.selectedCategory ? '' : this.printCategories()}
                </div>
            </div>)
    }
}

export default QuestionerCard;