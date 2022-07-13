// Components often need an 'enum', but there is a lot of boiler plate to do
// these 'properly' which also places a const on consumers of our component.
const within =
  (...options) =>
  (value) =>
    options.includes(value)

export { within }
