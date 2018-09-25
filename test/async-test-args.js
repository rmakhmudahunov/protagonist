const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;
const protagonist = require('./protagonist');

const data = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-api.apib'), 'utf8');
const sync_parsed = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-api-refract.json'), 'utf8');
const sync_parsed_sm = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-api-refract-sourcemap.json'), 'utf8');

describe('Async parse correctly handling options', () => {

  it('will export source maps', function() {
    protagonist.parse(data, { exportSourcemap : true })
      .then(res => {
        assert.deepEqual(res, sync_parsed_sm);
      })
      .catch(err => {
        assert.fail()
      })
  })

  it('will not export source maps', function() {
    protagonist.parse(data, { exportSourcemap : false })
      .then(res => {
        assert.deepEqual(res, sync_parsed);
      })
      .catch(err => {
        assert.fail()
      })
  })

  it('will accept empty options', function() {
    protagonist.parse(data, {})
      .then(res => {
        assert.deepEqual(res, sync_parsed);
      })
      .catch(err => {
        assert.fail()
      })
  })

})


describe('Async parsing - accepted parameters', () => {

  const source = '# API\n ## GET /\n+ Response 200 (text/plain)\n        Hello world\n'

  describe('Promise', () => {
    it('will accept source only', (done) => {
      protagonist.parse(data)
        .then(res => {
          assert.isNotNull(res)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('will accept source with options', (done) => {
      protagonist.parse(source, {exportSourcemap : true})
        .then(res => {
          assert.isNotNull(res)
          done()
        })
        .catch(err => {
          done(err)
        })
    })

    it('will not accept swapped params', (done) => {
      try {
        protagonist.parse({exportSourcemap : true}, source)
          .then(res => { assert.fail() })
      } catch (err) {
        assert.equal(err, 'TypeError: wrong 1st argument - string expected')
        done()
      }
    })

    it('will not accept no params', (done) => {
      try {
        protagonist.parse()
          .then(res => { assert.fail() })
      } catch (err) {
        assert.match(err, /TypeError: wrong number of arguments/)
        done()
      }
    })

    it('will not accept too much params', (done) => {
      try {
        protagonist.parse('a','b','c', 'd')
          .then(res => { assert.fail() })
      } catch (err) {
        assert.match(err, /TypeError: wrong number of arguments/)
        done()
      }
    })

    it('will not accept wrong wrong type for options', (done) => {
      try {
        protagonist.parse('a','b')
          .then(res => { assert.fail() })
      } catch (err) {
        assert.match(err, /TypeError: wrong 2nd argument - object expected/)
        done()
      }
    })

  })


  describe('Callback', () => {
    it('will accept source and callback', (done) => {
      protagonist.parse(source, (err, res) => {
        assert.isNull(err)
        assert.isDefined(res)
        done()
      })
    })

    it('will accept source, options and callback', (done) => {
      protagonist.parse(source, {exportSourcemap : true}, (err, res) => {
        assert.isNull(err)
        assert.isDefined(res)
        done()
      })
    })

    it('will not accept swapped callback and source', (done) => {
      try {
        protagonist.parse(function (err, res) {
          assert.fail()
        }, source)
      } catch (err) {
        assert.equal(err, 'TypeError: wrong 1st argument - string expected')
        done()
      }
    })

    it('will not accept just callback without source', (done) => {
      try {
        protagonist.parse(function (err, res) {
          assert.fail()
        })
      } catch (err) {
        assert.match(err, /TypeError: wrong 1st argument - string expected/)
        done()
      }
    })

    it('will not accept wrong type for options', (done) => {
      try {
        protagonist.parse('a','b',function (err, res) {
          assert.isNull(res)
        })
      }
      catch (err) {
        assert.match(err, /TypeError: wrong 2nd argument - object expected/)
        done()
      }
    })
  })
})