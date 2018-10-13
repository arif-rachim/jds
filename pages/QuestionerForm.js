import React from 'react';
import fetch from "isomorphic-fetch";

class QuestionerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.categories = props.categories;
        this.state.stores = props.stores;
        this.state.questions = props.questions;
    }

    static async getInitialProps() {
        let response = await fetch('http://localhost:3000/api/database?c=Category&a=read', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let categories = await response.json();
        response = await fetch(`http://localhost:3000/api/database?c=Store&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let stores = await response.json();
        response = await fetch(`http://localhost:3000/api/database?c=Question&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let questions = await response.json();
        return {
            categories, stores, questions
        }
    }

    async onFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        data.imageRequired = false;
        for (let key of formData.keys()) {
            if (key.indexOf('store') >= 0) {
                data.stores = data.stores || [];
                data.stores.push(formData.get(key));
            } else {
                data[key] = formData.get(key);
            }
            if (key === 'imageRequired') {
                data.imageRequired = true;
            }
        }
        let response = await fetch(`http://localhost:3000/api/database?c=Question&a=create`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });
        let result = await response.json();
        if (result.ok) {
            alert('Record Created');
        }
        await this.updateQuestionList();
    }

    async updateQuestionList() {
        let response = await fetch(`http://localhost:3000/api/database?c=Question&a=read`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let questions = await response.json();
        this.setState({
            questions
        });
    }

    printStore(store, index) {
        return (
            <div className="form-check form-check-inline" key={store._id}>
                <input className="form-check-input" type="checkbox" id={store._id} value={store._id}
                       name={`store_${index}`}></input>
                <label className="form-check-label" htmlFor={store._id}>{store.store}</label>
            </div>
        );
    }

    async deleteQuestion(question) {
        // ok lets delete this question
        const confirmDelete = confirm(`Are you sure you want to delete this question : ${question.question} ?`);
        if (!confirmDelete) {
            return;
        }
        let response = await fetch(`http://localhost:3000/api/database?c=Question&a=delete`, {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(question)
        });
        let result = await response.json();
        this.updateQuestionList();

    }

    printQuestion(question, index) {
        const printCategory = (categoryId) => {
            const categories = this.state && this.state.categories && this.state.categories.length > 0 ? this.state.categories.filter(cat => cat._id === categoryId) : [];
            return categories.length > 0 ? categories[0].category : '';
        };

        const printStores = (storeIds) => {
            const stores = this.state.stores.filter(st => storeIds.indexOf(st._id)>=0);
            const map = stores.map(store => <div key={store._id}>{store.store}</div>)
            return map;
        };

        return (
            <tr key={question._id}>
                <td>{index + 1}</td>

                <td>{printCategory(question.category)}</td>

                <td>{question.question}</td>
                <td>{question.type}</td>

                <td>{question.imageRequired.toString()}</td>

                <td>{printStores(question.stores)}</td>

                <td>
                    <button className={'btn btn-danger'} onClick={() => this.deleteQuestion(question)}>Delete</button>
                </td>
            </tr>
        );
    }

    render() {
        return (<div className={'container'}>
            <form action="" onSubmit={this.onFormSubmit.bind(this)} className={'card container'}>
                <h3 className={'display-4'}>Question Form</h3>
                <div className={'form-group'}>
                    <label htmlFor="category">Category :</label>
                    <select className="form-control" id={'category'} name={'category'} required>
                        {this.state.categories.map(category => <option value={category._id}
                                                                       key={category._id}>{category.category}</option>)}
                    </select>
                </div>
                <div className={'form-group'}>
                    <label htmlFor="question">Question :</label>
                    <input type="text" name={'question'} id={'question'} className="form-control" required/>
                </div>
                <div className={'form-group'}>
                    <label htmlFor="type">Type :</label>
                    <select className="form-control" name={'type'} id={'type'} required>
                        <option value={'boolean'}>Yes or No</option>
                        <option value={'text'}>Text</option>
                    </select>
                </div>
                <div className={'form-group'}>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="true" name="imageRequired"
                               id="imageRequired"></input>
                        <label className="form-check-label" htmlFor="imageRequired">
                            Image Required
                        </label>
                    </div>
                </div>
                <div className={'form-group'}>
                    <h4>Store</h4>
                    {this.state.stores.map(this.printStore)}
                </div>
                <div className={'form-group'}>
                    <input type="submit" value={'Save'} className={'btn btn-primary'}/>
                </div>
            </form>

            <table className={'table table-stripped'} style={{marginTop: '1rem'}}>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Category</th>
                    <th>Question</th>
                    <th>Type</th>
                    <th>Image Required</th>
                    <th>Store</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {this.state.questions.map(this.printQuestion.bind(this))}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
        </div>)
    }
}

export default QuestionerForm;