import Store from 'electron-store'

const schema = {
  items: {
    type: 'array',
    default: [],
  },
}

const store = new Store({ schema });

export default store;