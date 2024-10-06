import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import data from "../../Data/Data";

function Titulli({ titulli }) {
  const [siteName, setSiteName] = useState("FinanCare");

  useEffect(() => {
    const vendosTeDhenatBiznesit = async () => {
      try {
        setSiteName(data.ShfaqTeDhenat.emriIBiznesit);
      } catch (err) {
        console.log(err);
      }
    };

    vendosTeDhenatBiznesit();
  }, [titulli]);

  return (
    <Helmet>
      <title>
        {titulli} | {siteName}
      </title>
    </Helmet>
  );
}

export default Titulli;
