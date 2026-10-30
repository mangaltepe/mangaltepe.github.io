const $ = (id) => document.getElementById(id);
let frame = $('engine');
let ready;
let sequence = 0;
let timeout;
function status(text, error = false) {
    $('status').textContent = text;
    document.querySelector('.viewer').classList.toggle('error', error);
}
function engine() {
    if (!ready) {
        ready = new Promise((resolve, reject) => {
            const timer = setTimeout(() => { ready = null; reject(new Error('Görüntüleyici başlatılamadı. Sayfayı yenileyip tekrar dene.')); }, 20000);
            const listener = (event) => {
                if (event.source !== frame.contentWindow || event.origin !== location.origin || event.data?.type !== 'modelscope:ready') return;
                clearTimeout(timer); window.removeEventListener('message', listener); resolve();
            };
            window.addEventListener('message', listener);
            frame.src = 'vendor/netron/index.html';
        });
    }
    return ready;
}
function fail(message) {
    clearTimeout(timeout); $('loading').hidden = true;
    status(message, true); $('format').textContent = 'HATA';
}
async function open(files) {
    const file = files[0];
    if (!file) return;
    if (!/\.(pt|pth|onnx)$/i.test(file.name)) { status('Desteklenmeyen uzantı. .pt, .pth veya .onnx seç.', true); return; }
    if (file.size === 0) { status('Dosya boş. Geçerli bir model seç.', true); return; }
    const id = ++sequence;
    const replacement = frame.cloneNode(false);
    replacement.removeAttribute('src');
    frame.replaceWith(replacement);
    frame = replacement;
    ready = null;
    clearTimeout(timeout); $('loading').hidden = false; $('empty').hidden = true;
    $('file-card').hidden = false; $('file-name').textContent = file.name;
    $('file-size').textContent = `${(file.size / 1024 / 1024).toLocaleString('tr-TR', {maximumFractionDigits:2})} MB · ${files.length} dosya`;
    $('viewer-title').textContent = file.name; $('format').textContent = 'OKUNUYOR';
    status('Model ayrıştırılıyor…');
    try {
        await engine(); if (id !== sequence) return;
        frame.hidden = false;
        frame.contentWindow.postMessage({type:'modelscope:open', files:Array.from(files), id}, location.origin);
        timeout = setTimeout(() => { if (id === sequence) { $('loading').hidden = true; status('Model hâlâ işleniyor. Büyük dosyalar uzun sürebilir. Yeni bir dosya da açabilirsin.'); } }, 60000);
    } catch (error) { if (id === sequence) fail(error.message); }
}
window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    const message = event.data;
    if (message?.id !== sequence) return;
    if (message.type === 'modelscope:error') fail(`Açılamadı: ${message.message}`);
    if (message.type === 'modelscope:opened') {
        clearTimeout(timeout); $('loading').hidden = true;
        $('format').textContent = message.format || 'MODEL';
        status(`${message.nodes} düğüm · ${message.graphs} grafik · Katmanları incelemek için bir düğüme tıkla.`);
        $('status-dot').style.background = '#428358';
    }
});
$('file').addEventListener('change', (event) => open(event.target.files));
$('dropzone').addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); $('file').click(); } });
for (const name of ['dragenter','dragover']) $('dropzone').addEventListener(name, (e) => { e.preventDefault(); $('dropzone').classList.add('dragging'); });
for (const name of ['dragleave','drop']) $('dropzone').addEventListener(name, (e) => { e.preventDefault(); $('dropzone').classList.remove('dragging'); });
$('dropzone').addEventListener('drop', (e) => open(e.dataTransfer.files));
$('demo').addEventListener('click', async () => {
    $('demo').disabled = true;
    try { const response = await fetch('examples/tiny-network.onnx'); if (!response.ok) throw new Error('Örnek dosya yüklenemedi.'); await open([new File([await response.blob()], 'tiny-network.onnx')]); }
    catch (error) { fail(error.message); }
    finally { $('demo').disabled = false; }
});
$('clear').addEventListener('click', () => {
    ++sequence; clearTimeout(timeout); frame.removeAttribute('src'); frame.hidden = true; ready = null;
    $('loading').hidden = true; $('empty').hidden = false; $('file-card').hidden = true; $('file').value = '';
    $('viewer-title').textContent = 'Model görünümü'; $('format').textContent = 'HAZIR'; status('Bir model dosyası bekleniyor');
});
$('help').addEventListener('click', () => $('help-dialog').showModal());
$('close-help').addEventListener('click', () => $('help-dialog').close());
$('help-dialog').addEventListener('click', (event) => { if (event.target === $('help-dialog')) { const r = event.target.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.target.close(); } });
$('fullscreen').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.querySelector('.viewer').requestFullscreen(); }
    catch { status('Tarayıcın tam ekranı desteklemiyor. Grafiğin yakınlaştırma düğmelerini kullan.'); }
});
