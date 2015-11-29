import Joi from 'joi';

/**
 * @param ast
 * @returns {Object}
 */
export function createSchemas (ast) {
  return ast.types().reduce((types, type) => {
    types[type.name()] = createSchema(type);
    return types;
  }, {})
}

/**
 * @param type
 * @returns {Object} Joi schema
 */
export function createSchema (type) {
  let types = type.type();

  if (types.length === 1) {
    switch (types[0]) {
      case 'string':
      case 'number':
      case 'integer':
      case 'boolean':
      case 'date':
        return Scalar[types[0]](type);
      default:
    }
  } else {
    throw new Error('Not Implemented');
  }
}

let Scalar = {
  string (type) {
    let t = Joi.string();
    if (type.minLength() !== null) t = t.min(type.minLength());
    if (type.maxLength() !== null) t = t.max(type.maxLength());
    if (type.pattern() !== null) t = t.regex(new RegExp(type.pattern()));
    if (type.enum().length) t = t.regex(new RegExp(`^(${type.enum().join('|')})$`));
    return t;
  },
  number (type) {

  },
  integer (type) {

  },
  booleanr (type) {

  },
  date (type) {

  }
};
