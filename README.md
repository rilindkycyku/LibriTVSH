<body>

<h1>LibriTVSH - Besa Një SH.P.K.</h1>
    
<p><strong>LibriTVSH</strong> është një aplikacion web i krijuar posaçërisht për nevojat e <strong>Besa Një SH.P.K.</strong>, për të ruajtur dhe menaxhuar detajet kryesore të faturave të blerjes (Libri i Blerjes për TVSH).</p>
    
<p>Ky aplikacion ndihmon në regjistrimin e saktë të të dhënave të nevojshme dhe ruajtjen e tyre, duke u fokusuar ekskluzivisht te faturat e blerjes së biznesit tonë.</p>

<h2>Aplikacioni Live</h2>
    <p>Përdorni aplikacionin direkt këtu: <a href="https://libritvsh.rilindkycyku.dev/" target="_blank">https://libritvsh.rilindkycyku.dev/</a></p>

<h2>Si të instaloni dhe ekzekutoni lokalisht</h2>
    <ol>
        <li>Klononi repository-n:
            <pre><code>git clone https://github.com/rilindkycyku/LibriTVSH.git</code></pre>
        </li>
        <li>Hyni në folderin e projektit:
            <pre><code>cd LibriTVSH/libri-tvsh</code></pre>
        </li>
        <li>Instaloni dependencat:
            <pre><code>npm install</code></pre>
        </li>
        <li>Nisni serverin e zhvillimit:
            <pre><code>npm run dev</code></pre>
        </li>
        <li>Hapni <a href="http://localhost:5173" target="_blank">http://localhost:5173</a> në shfletuesin tuaj.</li>
    </ol>

<h2>Si të bëni build për production</h2>
    <ol>
        <li>Ekzekutoni:
            <pre><code>npm run build</code></pre>
        </li>
        <li>Rezultati do të gjendet në folderin <code>dist</code>, të cilin mund ta deploy-oni në çdo hosting statik.</li>
    </ol>

<h2>Veçoritë kryesore</h2>
    <ul>
        <li>Shtimi, editimi dhe fshirja e regjistrimeve të faturave të blerjes</li>
        <li>Llogaritje automatike e TVSH-së kredite</li>
        <li>Ruajtja e të dhënave lokalisht në shfletues (LocalStorage)</li>
        <li>Eksportimi i të dhënave në format CSV</li>
        <li>Ndërfaqe e thjeshtë dhe intuitive, e optimizuar për përdorim në desktop dhe mobile</li>
        <li>Pa nevojë për regjistrim ose server</li>
    </ul>

<p>Ky aplikacion është zhvilluar dhe mirëmbahet ekskluzivisht për përdorim të brendshëm nga <strong>Besa Një SH.P.K.</strong>.</p>

</body>