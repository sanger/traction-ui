/**
 * Components often need an 'enum', but there is a lot of boiler plate to do
 * these 'properly' which also places a cost on consumers of our component.
 *
 * @example
 * {
 *   props: {
 *     size: {
 *      type: String,
 *      required: false,
 *      default: 'md',
 *      validator: within('sm', 'md', 'lg'),
 *    },
 *  }
 * }
 *
 */
const within =
  (...options) =>
  (value) =>
    options.includes(value)

export { within }
