import React from 'react';

class QuestionerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    addQuestion() {
        this.setState({
            addQuestion: true
        });
    }

    closeAddQuestion(){
        this.setState({
            addQuestion: false
        });
    }

    render() {
        return (<div>
            <button onClick={this.addQuestion.bind(this)}>Add Question</button>
            <table>

                <thead>
                <tr>
                    <th>No</th>
                    <th>Category</th>
                    <th>Question</th>
                    <th>Type</th>
                    <th>Image Required</th>
                    <th>Store</th>
                </tr>
                </thead>
                <tbody>


                </tbody>
                <tfoot>
                <tr className={this.state.addQuestion ? '' : 'hide'}>
                    <td>#Auto generated</td>
                    <td>
                        <select name="category" id="">
                            <option value="">One</option>
                            <option value="">Two</option>
                        </select>

                    </td>
                    <td><input type="text"/></td>
                    <td><input type="text"/></td>
                    <td><input type="text"/></td>
                    <td><input type="text"/></td>
                </tr>
                </tfoot>
            </table>
            <div className={this.state.addQuestion ? '' : 'hide'}>
                <button>Save</button>
                <button onClick={this.closeAddQuestion.bind(this)}>Cancel</button>
            </div>
            <style jsx>{
                `
                .hide {
                    display : none
                }
                `
            }</style>
        </div>)
    }
}

export default QuestionerForm;