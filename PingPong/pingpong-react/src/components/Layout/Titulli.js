import { Helmet } from 'react-helmet';

function Titulli({ titulli }) {
  return (
    <Helmet>
      <title>{titulli} | Sport Store</title>
    </Helmet>
  );
}

export default Titulli;
