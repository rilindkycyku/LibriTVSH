function Footer() {
  return (
    <footer className="py-5 text-center">
      <div className="premium-card d-inline-block">
        <p className="m-0 text-muted fw-medium">
          &copy; {new Date().getFullYear()} <span className="fw-bold">Blerjet me TVSH</span>
          <span className="app-version ms-2" title={`Versioni ${__APP_VERSION__}`}>
            v{__APP_VERSION__}
          </span>
        </p>
        <p className="m-0 small text-muted mt-1">
          Produkt i <span className="fw-semibold">BESA NJË SH.P.K.</span>
        </p>
        <div className="mt-3 pt-3 border-top">
          <span className="text-muted small">Zhvilluar me ❤️ nga </span>
          <a
            href="https://rilindkycyku.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-bold text-decoration-none"
          >
            Rilind Kyçyku
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;