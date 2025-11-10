function Footer() {
  return (
    <>
      <style>
        {`
          .footer {
            text-align: center;
            padding: 1rem 0;
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
            margin-top: 1rem;
            width: 100%;
            box-sizing: border-box;
          }
          .footer a {
            color: #007bff;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        `}
      </style>
      <div className="footer">
        &copy; {new Date().getFullYear()} Blerjet me TVSH - Produkt i BESA NJË SH.P.K. - Zhvilluar nga{" "}
        <a href="https://rilindkycyku.dev" target="_blank" rel="noopener noreferrer">
          Rilind Kyçyku
        </a>
      </div>
    </>
  );
}

export default Footer;