import assert from 'node:assert/strict'
import test from 'node:test'

test('Fever API responds', async () => {
  const res = await fetch('http://localhost:3000/api/fever')
  assert.equal(res.status, 200)
})
