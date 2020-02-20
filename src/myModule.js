const message = 'Some message from myModule.js'

const name = 'Dongmin';

const location = 'Seoul';

const getGreeting = (name) => {
    return `Welcome to the course ${name}`

}

export { message, name, getGreeting, location as default };