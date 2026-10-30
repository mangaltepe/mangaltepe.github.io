import { Host } from './browser.js';
import { View, ModelFactoryService } from './view.js';
// ModelScope adapter for Netron 8.9.9. No analytics or remote model requests.
const host = new Host();
host._environment.version = '0.0.0';
host._environment.date = new Date();
host._environment.serial = true;
host.view = async function(view) { this._view = view; };
host.event = () => {};
host.exception = () => {};
ModelFactoryService.prototype.import = async () => {};
const view = new View(host);
window.__view__ = view;
let id;
const send = (type, data = {}) => parent.postMessage({ type:`modelscope:${type}`, id, ...data }, location.origin);
view.error = async (error) => { view.show('welcome'); send('error', {message:error.message || String(error)}); };
const openContext = host._openContext.bind(host);
host._openContext = async (context) => {
    const result = await openContext(context);
    if (result === '' && view.model) {
        const graphs = view.model.modules || [];
        send('opened', {format:view.model.format, graphs:graphs.length, nodes:graphs.reduce((sum, graph) => sum + (graph.nodes?.length || 0), 0)});
    }
    return result;
};
await view.start();
window.addEventListener('message', async (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.type !== 'modelscope:open') return;
    id = event.data.id;
    try { const files = event.data.files; await host._open(files[0], files); }
    catch (error) { send('error', {message:error.message}); }
});
send('ready');
