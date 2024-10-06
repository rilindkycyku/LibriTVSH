import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import data from "../../../Data/Data";

function KontrolloAksesinNeFaqe(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const kontrolloAksesin = () => {
      const getId = localStorage.getItem("id");
      if (getId) {
        try {
          const decodedToken = (data.shfaqPerdoruesit.find((item) => item.perdoruesi.aspNetUserID == getId).rolet); 
          // Check if the decoded token role contains any of the allowed roles
          const hasAccess = props.roletELejuara.some((role) =>
            decodedToken.includes(role)
          );

          if (hasAccess) {
            // User has access
          } else {
            navigate("/403"); // User doesn't have access
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        navigate("/login"); // No token, redirect to login
      }
    };

    kontrolloAksesin();
  }, [props.roletELejuara, navigate]); // Add roletELejuara and navigate to dependency array

  return <div></div>;
}

export default KontrolloAksesinNeFaqe;
