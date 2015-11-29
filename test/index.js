import { assert } from 'chai';
import { createSchemas } from '../src/index';
import raml from 'raml-js-parser-2';
import path from 'path';
import Joi from 'joi';

describe('createSchemas', () => {
  let ast;
  let isValid;
  let isInvalid;

  beforeEach(() => {
    ast = (file) => {
      let api = raml.loadApi(path.join(__dirname, `/schemas/${file}.raml`));
      api.errors().forEach(err => console.log(err));
      return api;
    };
    isValid = (values, schema) => {
      values.forEach(val => {
        Joi.validate(val, schema, (err, value) => {
          assert.equal(err, null);
          assert.equal(val, value);
        })
      });
    };
    isInvalid = (values, schema) => {
      values.forEach(val => {
        Joi.validate(val, schema, (err, value) => {
          assert.notEqual(err, null, 'Expected error for value: ' + val);
        })
      });
    };
  });

  describe('basic types', () => {
    describe('string', () => {
      describe('basic', () => {
        it('validates any string', () => {
          let schemas = createSchemas(ast('string'));
          isValid([ 'foo', 'bar', 'baz' ], schemas.String);
        });

        it('throws for non matches', () => {
          let schemas = createSchemas(ast('string'));
          isInvalid([ 1, 0.1, {}, [], null, false ], schemas.String);
        });
      });

      describe('pattern', () => {
        it('validates any only strings that match', () => {
          let schemas = createSchemas(ast('string'));
          isValid([ 'foo' ], schemas.Regexp);
        });

        it('throws for non matches', () => {
          let schemas = createSchemas(ast('string'));
          isInvalid([ 'bar', 'baz' ], schemas.Regexp);
        });
      });

      describe('minLength', () => {
        it('validates any only strings that match', () => {
          let schemas = createSchemas(ast('string'));
          isValid([ '12', '123', '12345' ], schemas.MinLength);
        });

        it('throws for non matches', () => {
          let schemas = createSchemas(ast('string'));
          isInvalid([ '1' ], schemas.MinLength);
        });
      });

      describe('maxLength', () => {
        it('validates any only strings that match', () => {
          let schemas = createSchemas(ast('string'));
          isValid([ '12', '123' ], schemas.MaxLength);
        });

        it('throws for non matches', () => {
          let schemas = createSchemas(ast('string'));
          isInvalid([ '1234', '12345' ], schemas.MaxLength);
        });
      });

      describe('enum', () => {
        it('validates any only strings that match', () => {
          let schemas = createSchemas(ast('string'));
          isValid([ 'foo', 'bar', 'baz' ], schemas.Enum);
        });

        it('throws for non matches', () => {
          let schemas = createSchemas(ast('string'));
          isInvalid([ 'foop', 'nbar', 'foobar' ], schemas.Enum);
        });
      });

      describe('combination', () => {
        it('validates any only strings that match', () => {
          let schemas = createSchemas(ast('string'));
          isValid([ '__', '+__+', '+__FF' ], schemas.Combination);
        });

        it('throws for non matches', () => {
          let schemas = createSchemas(ast('string'));
          isInvalid([ 'fooo', '++__++', '_', '______' ], schemas.Combination);
        });
      });
    });
  });
});
