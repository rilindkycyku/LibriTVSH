// Shirit i vetëm, jo bllok më vete: fundfaqja jeton brenda kartelës së
// regjistrit, prandaj mban vetëm një rresht dhe mbështillet vetë në celular.
function Footer() {
  return (
    <footer className="app-footer">
      <span>
        &copy; {new Date().getFullYear()} <span className="fw-bold">Blerjet me TVSH</span>
      </span>
      <span className="app-version" title={`Versioni ${__APP_VERSION__}`}>
        v{__APP_VERSION__}
      </span>
      <span className="app-footer__sep" aria-hidden="true">
        •
      </span>
      <span>
        Produkt i <span className="fw-semibold">BESA NJË SH.P.K.</span>
      </span>
      <span className="app-footer__sep" aria-hidden="true">
        •
      </span>
      <span>
        Zhvilluar me ❤️ nga{" "}
        <a
          href="https://rilindkycyku.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="fw-bold text-decoration-none"
        >
          Rilind Kyçyku
        </a>
      </span>
    </footer>
  );
}

export default Footer;
