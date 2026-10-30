import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ModelFactoryService } from '../vendor/netron/view.js';
import { BinaryStream } from '../vendor/netron/base.js';
const root = new URL('../vendor/netron/', import.meta.url);
const host = {
    type:'Test',
    require: (id) => import(new URL(`${id}.js`,root)),
    asset: (name) => readFile(new URL(name,root),'utf8'),
    event: () => {}, exception: () => {}
};
async function model(name) {
    const bytes = await readFile(new URL(`../examples/${name}`,import.meta.url));
    return new ModelFactoryService(host).open({
        ...host, identifier:name, stream:new BinaryStream(bytes),
        fetch: async () => { throw new Error('External file unavailable'); },
        error: (error) => { throw error; }
    });
}
test('ONNX demo exposes five connected operations and tensor shapes', async () => {
    const m = await model('tiny-network.onnx');
    assert.match(m.format,/ONNX/);
    assert.equal(m.modules[0].nodes.length,5);
    assert.equal(m.modules[0].nodes[0].type.name,'MatMul');
    assert.equal(m.modules[0].nodes[0].outputs[0].value[0].name,'hidden');
    assert.equal(m.modules[0].nodes[1].inputs[0].value[0].name,'hidden');
    assert.deepEqual(m.modules[0].inputs[0].value[0].type.shape.dimensions,[1,4]);
});
test('PT state_dict exposes real parameter shapes', async () => {
    const m = await model('tiny-weights.pt');
    assert.match(m.format,/PyTorch/);
    const nodes = m.modules[0].nodes;
    assert.ok(nodes.length >= 2);
    const tensors = nodes.flatMap(n=>n.inputs).flatMap(i=>i.value).filter(v=>v.initializer);
    assert.ok(tensors.some(t=>JSON.stringify(t.type.shape.dimensions)==='[3,4]'));
});
test('corrupt PT is rejected', async () => {
    await assert.rejects(new ModelFactoryService(host).open({...host,identifier:'bad.pt',stream:new BinaryStream(new TextEncoder().encode('this is not a pytorch model'))}));
});
