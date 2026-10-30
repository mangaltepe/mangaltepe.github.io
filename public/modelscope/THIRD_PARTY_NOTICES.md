# Third-party software

ModelScope bundles a subset of Netron 8.9.9 by Lutz Roeder, licensed under MIT.
Source: https://github.com/lutzroeder/netron/tree/v8.9.9/source
License: vendor/netron/LICENSE

Modifications: `index.html` uses `modelscope.js` as its entry point and a local-only
content security policy. `modelscope.js` adapts the host, disables telemetry and
version-expiry prompts, and connects the local viewer to the ModelScope UI.
Only the PyTorch and ONNX readers and their dependencies are bundled.
