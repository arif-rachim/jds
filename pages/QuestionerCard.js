import React from 'react';

const questions = [
    {
        category: 'Flour',
        questions: [
            {
                title: 'Does the this store has Flour Big?',
                image: 'image-one.jpg',
                type: 'boolean'
            },
            {
                title: 'Tell me about the flour size Flour Medium ?',
                image: 'image-two.jpg',
                type: 'text'
            },
            {
                title: 'Does the this store has Flour Small ?',
                image: 'image-three.jpg',
                type: 'boolean'
            }
        ]
    },
    {
        category: 'Eggs',
        questions: [
            {
                title: 'Does the this store has Eggs Big?',
                image: 'image-one.jpg',
                type: 'boolean'
            },
            {
                title: 'Tell me about the flour size Eggs Medium ?',
                image: 'image-two.jpg',
                type: 'text'
            },
            {
                title: 'Does the this store has Eggs Small ?',
                image: 'image-three.jpg',
                type: 'boolean'
            }
        ]
    },
    {
        category: 'Oats',
        questions: [
            {
                title: 'Does the this store has Oats Big?',
                image: 'image-one.jpg',
                type: 'boolean'
            },
            {
                title: 'Tell me about the flour size Oats Medium ?',
                image: 'image-two.jpg',
                type: 'text'
            },
            {
                title: 'Does the this store has Oats Small ?',
                image: 'image-three.jpg',
                type: 'boolean'
            }
        ]
    }
];

class QuestionerCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>Question Card</div>
    }
}

export default QuestionerCard;