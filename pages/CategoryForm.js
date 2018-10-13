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
            body: JSON.stringify(category)
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
            <div className={'container'}>

                <form action="" onSubmit={this.onSaveCategory.bind(this)} className={'card container'}>
                    <h3 className={'display-4'}>Category Form</h3>
                    <div className={'form-group'}>
                        <label htmlFor="category">Category Name</label>
                        <input type="text" name={'category'} required className={'form-control'}/>
                    </div>
                    <div className={'form-group'}>
                    <input type="submit" value={'Add'} className={'btn btn-primary'}/>
                    </div>
                </form>
                <table  className={'table table-striped'}>
                    <thead>
                    <tr>
                        <th style={{width:'50px'}}>No</th>
                        <th>Category</th>
                        <th style={{width:'100px'}}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.categories.map((category, index) => (<tr key={category._id}>
                        <td>{index + 1}</td>
                        <td style={{fontWeight:'bold'}}>{category.category}</td>
                        <td>
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.deleteCategory(category)
                            }} className={'btn btn-danger'}>Delete
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