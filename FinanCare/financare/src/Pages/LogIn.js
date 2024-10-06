import React from "react";
import { Helmet } from "react-helmet";
import NavBar from "../Components/TeTjera/layout/NavBar";
import Form from "react-bootstrap/Form";
import "./Styles/LogIn.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import Mesazhi from "../Components/TeTjera/layout/Mesazhi";
import Titulli from "../Components/TeTjera/Titulli";

const LogIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState("");
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");

  function vendosEmail(value) {
    setEmail(value);
  }

  function vendosPasswordin(value) {
    setPassword(value);
  }

  const ndrroField = (e, tjetra) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById(tjetra).focus();
    }
  };

  const handleMenaxhoTastet = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const users = [
    {
      role: "Financa",
      email: "financa.financa@financare.com",
      id: "7553cfb4-093e-428c-ae2f-68aea8b8767a",
    },
    {
      role: "Mbeshtetje Klientit",
      email: "mbeshtetje.klientit@financare.com",
      id: "c8f9f05e-3d2f-407b-b082-f5405fd97d9c",
    },
    {
      role: "Qmimore",
      email: "qmimore.qmimore@financare.com",
      id: "d8918bff-7926-456f-bec0-cf3356a62824",
    },
    {
      role: "Faturist",
      email: "faturist.faturist@financare.com",
      id: "f6c341aa-79e4-42fb-bcd1-be031b7d8357",
    },
    {
      role: "Puntor Thjeshte",
      email: "puntor.thjeshte@financare.com",
      id: "8c3e98d7-f7cc-45c2-bf09-3bc3dfb89e5c",
    },
    {
      role: "Burime Njerzore",
      email: "burime.njerzore@financare.com",
      id: "d677de99-762e-430a-abee-0c48c6595b58",
    },
    {
      role: "Komercialist",
      email: "komercialist.komercialist@financare.com",
      id: "d833b2ff-e681-4266-8c99-792c54a93ef1",
    },
    {
      role: "Kalkulant",
      email: "kalkulant.kalkulant@financare.com",
      id: "e3a0fcb7-296a-4458-aad5-ef1143205642",
    },
    {
      role: "Menaxher",
      email: "menaxher.menaxher@financare.com",
      id: "a62e8d51-48fa-44af-b70e-d9f3b01591e7",
    },
    {
      role: "Arkatar",
      email: "arkatar.arkatar@financare.com",
      id: "1545403d-e285-4247-812d-2c7cd81c80f4",
    },
  ];

  return (
    <>
      <Titulli titulli={"Login"} />

      <div className="logIn">
        {shfaqMesazhin && (
          <Mesazhi
            setShfaqMesazhin={setShfaqMesazhin}
            pershkrimi={pershkrimiMesazhit}
            tipi={tipiMesazhit}
          />
        )}
        <MDBContainer fluid>
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{
              border: "none",
              boxShadow: "0 0 20px #ddd",
              borderRadius: "2rem",
              maxWidth: "500px",
              color: "#FFFFFF", // Set text color to white
            }}>
            <MDBCardBody
              className="p-5 w-100 d-flex flex-column"
              style={{
                border: "none",
                boxShadow: "0 0 20px #ddd",
                borderRadius: "2rem",
                maxWidth: "500px",
                backgroundColor: "#009879",
              }}>
              <img
                src={`${process.env.PUBLIC_URL}/img/web/d144a4e21cb54a7fb9c5a21d4eebdd50.svg`}
                alt="Logo"
                className="logo mb-4"
                style={{ maxWidth: "300px", alignSelf: "center" }}
              />
              <h3 className="formTitle">Log In</h3>
              <p className="text-white-20 mb-4 p-text">
                Please enter your email and password!
              </p>

              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Email address"
                id="formControlEmailAddress"
                type="email"
                size="lg"
                onChange={(e) => vendosEmail(e.target.value)}
                onKeyDown={(e) => {
                  ndrroField(e, "formControlPassword");
                }}
              />
              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Password"
                id="formControlPassword"
                type="password"
                size="lg"
                onChange={(e) => vendosPasswordin(e.target.value)}
                onKeyDown={handleMenaxhoTastet}
              />
              <button class="button btn btn-primary btn-lg " role="button">
                Login
              </button>
              {users.map((user) => (
                <button
                  key={user.id}
                  class="button btn btn-primary btn-lg mt-1" role="button"
                  onClick={() => {
                    localStorage.setItem("id", user.id);
                    navigate("/");
                  }}>
                  Kyqu si {user.role}
                </button>
              ))}
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </div>
    </>
  );
};

export default LogIn;
