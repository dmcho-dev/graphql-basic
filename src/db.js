
// Demo user data
const users = [
    {
        id: '1', 
        name: 'Dongmin',
        email: 'dmcho@gmail.com',
        age: 37,
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'sarah@gmail.com',
        age: 27,
    },
    {
        id: '3',
        name: 'Jack',
        email: 'jack@gmail.com',
        age: 27,
    },
]

const posts = [
    {
        id: '10',
        title: "Graphql 101",
        body: 'title alpha 1',
        published: true,
        author: '1'
    },
    {
        id: '20',
        title: "Graphql 201",
        body: 'title alpha 2',
        published: false,
        author: '1'
    },
    {
        id: '30',
        title: "Graphql 301",
        body: 'title alpha 3',
        published: false,
        author: '2'
    },
]

const comments = [
    {
        id: '102',
        author: '3',
        post: '10',
        text: "This worked well for me. thanks!"
    },
    {
        id: '103',
        author: '1',
        post: '10',
        text: "Glad This worked well for me. thanks!"
    },
    {
        id: '104',
        author: '2',
        post: '20',
        text: "This did no work."
    },
    {
        id: '105',
        author: '1',
        post: '30',
        text: "wow"
    },
]


const db = {
    users,
    posts,
    comments,
}

export { db as default }