"""Generate deterministic ONNX and torch.save-compatible state_dict fixtures.
No PyTorch or ONNX installation is required. The PT fixture has weights only.
"""
from pathlib import Path
import struct
import io
import pickle
import types
import sys
import collections
import zipfile

ROOT = Path(__file__).resolve().parent.parent

def varint(value):
    result = bytearray()
    while value > 127:
        result.append((value & 127) | 128)
        value >>= 7
    result.append(value)
    return bytes(result)

def field(number, value):
    if isinstance(value, int):
        return varint(number << 3) + varint(value)
    if isinstance(value, str):
        value = value.encode()
    return varint((number << 3) | 2) + varint(len(value)) + value

def info(name, dims):
    shape = b''.join(field(1, field(1, d)) for d in dims)
    return field(1, name) + field(2, field(1, field(1, 1) + field(2, shape)))

def tensor(name, dims, values):
    return b''.join(field(1, d) for d in dims) + field(2, 1) + field(8, name) + field(9, struct.pack('<'+'f'*len(values), *values))

def node(name, op, inputs, outputs):
    return b''.join(field(1, s) for s in inputs) + b''.join(field(2, s) for s in outputs) + field(3, name) + field(4, op)

def main():
    out = ROOT / 'examples'
    out.mkdir(exist_ok=True)
    graph = field(2, 'Tiny classifier')
    for n in [node('encoder.linear','MatMul',['input','encoder.weight'],['hidden']), node('encoder.bias','Add',['hidden','encoder.bias'],['biased']), node('activation','Relu',['biased'],['activated']), node('classifier.linear','MatMul',['activated','classifier.weight'],['logits']), node('probabilities','Softmax',['logits'],['output'])]:
        graph += field(1, n)
    graph += field(5, tensor('encoder.weight',[4,3],[.1,.2,.3,.4,.5,.6,.7,.8,.9,1.,1.1,1.2]))
    graph += field(5, tensor('encoder.bias',[3],[.1,.2,.3]))
    graph += field(5, tensor('classifier.weight',[3,2],[.1,.2,.3,.4,.5,.6]))
    graph += field(11, info('input',[1,4])) + field(12, info('output',[1,2]))
    model = field(1,8) + field(2,'ModelScope') + field(7,graph) + field(8,field(2,13))
    (out / 'tiny-network.onnx').write_bytes(model)

    torch = types.ModuleType('torch')
    utils = types.ModuleType('torch._utils')
    exec('def _rebuild_tensor_v2(*args): pass', utils.__dict__)
    torch.FloatStorage = type('FloatStorage', (), {'__module__':'torch'})
    sys.modules['torch'] = torch
    sys.modules['torch._utils'] = utils
    class Storage:
        def __init__(self, key, count): self.key, self.count = key, count
    class Tensor:
        def __init__(self, key, dims): self.key, self.dims = key, dims
        def __reduce__(self):
            count = 1
            for d in self.dims: count *= d
            stride, step = [], 1
            for d in reversed(self.dims): stride.insert(0,step); step *= d
            return utils._rebuild_tensor_v2, (Storage(self.key,count),0,self.dims,tuple(stride),False,collections.OrderedDict())
    class Pickler(pickle.Pickler):
        def persistent_id(self,obj):
            if isinstance(obj,Storage): return ('storage',torch.FloatStorage,obj.key,'cpu',obj.count)
    buffer = io.BytesIO()
    state = collections.OrderedDict([('encoder.weight',Tensor('0',(3,4))),('encoder.bias',Tensor('1',(3,))),('classifier.weight',Tensor('2',(2,3)))])
    Pickler(buffer,protocol=2).dump(state)
    with zipfile.ZipFile(out / 'tiny-weights.pt','w',compression=zipfile.ZIP_STORED) as z:
        z.writestr('archive/data.pkl',buffer.getvalue())
        z.writestr('archive/version','3\n')
        z.writestr('archive/byteorder','little')
        for key, count in [('0',12),('1',3),('2',6)]:
            z.writestr('archive/data/'+key,struct.pack('<'+'f'*count,*[i/10 for i in range(count)]))
    print('Generated ONNX graph and PT state_dict examples.')

if __name__ == '__main__': main()
