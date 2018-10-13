import React from 'react';
import fetch from 'isomorphic-fetch';

class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.categories = this.props.categories;
    }

    static async getInitialProps() {
        let response = await fetch('http://localhost:3000/api/database?c=Category&a=read', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let result = await response.json();
        return {
            categories: result
        }
    }

    async onSaveCategory(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value
        });
        let response = await fetch('http://localhost:3000/api/database?c=Category&a=create', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });
        let result = await response.json();
        if (result.ok) {
            await this.updateCategories();
            form.reset();
        }
    }

    async deleteCategory(category) {
        const userConfirm = confirm('Are you sure you want to remove category ?');
        if (!userConfirm) {
            return false;
        }
        let response = await fetch('http://localhost:3000/api/database?c=Category&a=delete', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({category: category.category})
        });
        let result = await response.json();
        this.updateCategories();
    }

    async updateCategories() {
        let response = await fetch('http://localhost:3000/api/database?c=Category&a=read', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({})
        });
        let result = await response.json();
        this.setState({
            categories: result
        });
    }

    render() {
        return (
            <div>
                <form action="" onSubmit={this.onSaveCategory.bind(this)}>
                    <input type="text" name={'category'} required placeholder="Category Name"/>
                    <input type="submit" value={'Add'}/>
                </form>
                <table>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Category</th>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.categories.map((category, index) => (<tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.category}</td>
                        <td>
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.deleteCategory(category)
                            }}>Delete
                            </button>
                        </td>
                    </tr>))}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>

            </div>
        );
    }
}

export default CategoryForm;