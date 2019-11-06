const data = {
    polls: [{
        id: '1',
        question: 'Who is the greatest basketball player of all time?',
        choices: [
            { id: '1', value: 'Lebron', acceptable: false },
            { id: '2', value: 'Michael', acceptable: true },
            { id: '3', value: 'Kareem', acceptable: false },
        ],
    }, {
        id: '2',
        question: 'Does this make me look fat?',
        choices: [
            { id: '1', value: 'Yes', acceptable: false },
            { id: '2', value: 'No', acceptable: true },
        ],
    }]
};

module.exports = data;