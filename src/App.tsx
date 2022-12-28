import React, {useState} from 'react';
import axios from "axios";
import './App.css';
import config from "./config";
import {DocRequest} from "./types/document";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './images/logo.jpg';
import logokiai from './kiai/images/logo.jpg';
import Ok from './images/Ok.png';
import inProcessing from './images/process.png';
import errorupload from './images/error.png';
import upload from './images/upload.png';

function App() {
    const FirmaTheme = React.lazy(() => import('./firmaTheme'));
    const KiaiTheme = React.lazy(() => import('./kiaiTheme'));

    const ThemeSelector = ({ children }: any) => {
        return (
            <>
                <React.Suspense fallback={<></>}>
                    { process.env.REACT_APP_Theme === 'FirmaSeguro' ? (
                        <FirmaTheme/>
                        ): <KiaiTheme/>
                    }
                </React.Suspense>
                {children}
            </>
        )
    }
  const [nameCase, setNameCase] = useState("");
  const [documentStatus, setDocumentStatus] = useState();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState(false);

  let [filename, setFilename] = useState('application/pdf');
  const url = `${config.baseApiUrl}/Document/validate-document`;
  const createImage = (pdf: DocRequest) => axios.post(url, pdf);


  const createPost = async (post: any) => {
      try {
          await createImage(post).then(function(response){
            if (response.status === 200) {
              setError(false);
              setNameCase(response.data.nameCase);
              setDocumentStatus(response.data.documentStatus);
              setSignatures(response.data.signatures);
            }
          }).catch(function(e) {
            setError(true);
            if (axios.isCancel(e)) {
              console.log(`request cancelled:${e.message}`);
            } else {
              console.log("another error happened:" + e.message);
            }
          });
      } catch (error) {
          console.log(error);
      }
  };

  const convertToBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
      });
  };
  const handleFileUpload = async (e:any) => {

      const file = e.target.files[0];
      const base64 = (await convertToBase64(file) as string).split(",")[1];
      setFilename(file.type);
      e.preventDefault();
      if(filename === 'application/pdf'){
        await createPost({documentBase64: base64});
      }
  };


  return (
      <React.Fragment>

          <ThemeSelector>
                <div className="app front_app">
                    <div className="main">
                  <div className="logo">
                      {process.env.REACT_APP_Theme === 'FirmaSeguro' ? (
                          <img src={logo} alt="logo platform" />
                      ): (
                          <img src={logokiai} alt="logo platform" />
                      ) }
                  </div>
                  <div className="top">
                      <div className="user">
                      </div>
                  </div>
                  <div className="content">
                      <main role="main">
                          <div className="main_content">
                              <h1>Verifica tus documentos ahora</h1>
                              <>
                                  <div className="text-center" >
                                  {documentStatus === 3 && !error && nameCase ? (
                                      <img src={Ok} className="img-fluid mx-auto" alt="Ok" style={{"height" : "130px"}}/>
                                      ): documentStatus === 2 && !error && nameCase ?(
                                      <img src={inProcessing} className="img-fluid mx-auto" alt="Ok" style={{"height" : "130px"}}/>
                                  ): error ? (
                                      <img src={errorupload} className="img-fluid mx-auto" alt="Ok" style={{"height" : "130px"}}/>
                                  ): (
                                      <img src={upload} className="img-fluid mx-auto" alt="Ok" style={{"height" : "130px"}}/>
                                  )}
                                  </div>
                              </>
                              <section className="review">
                                  <div className="box_front ">
                                      <div>
                                          {filename !== 'application/pdf' ? (
                                              <p className="text-danger">Este documento no tiene un formato correcto.</p>
                                          ): (
                                              <>
                                                  {!error ? (
                                                      <>
                                                          {nameCase ? (
                                                              <>
                                                                  {documentStatus === 3 ? (
                                                                      <div>

                                                                          <div className="signers">
                                                                              <h3 className="text-center">N° Caso</h3>
                                                                              <div className="action">
                                                                                  <p>{nameCase}</p>
                                                                              </div>

                                                                              <h3 className="text-center">Firmante(s)</h3>
                                                                              <table>
                                                                                  <thead>
                                                                                  <tr>
                                                                                      <th>Nombre</th>
                                                                                      <th>Fecha</th>
                                                                                  </tr>
                                                                                  </thead>
                                                                                  <tbody>
                                                                                  {signatures.map((item, i) => {
                                                                                      return (
                                                                                          <tr key={i}>
                                                                                              <td>{item[0]}</td>
                                                                                              <td>{item[1]}</td>
                                                                                          </tr>
                                                                                      )
                                                                                  })}
                                                                                  </tbody>
                                                                              </table>
                                                                          </div>
                                                                      </div>
                                                                  ): (
                                                                      <p className="text-warning">El documento esta en proceso de firma, cuando se halla finalizado el proceso se podrá verificar.</p>
                                                                  )}
                                                              </>
                                                          ):null}
                                                      </>
                                                  ): (
                                                      <p className="text-danger">Este documento no esta firmado por <strong>Firma Seguro</strong> o ha sido modificado.</p>
                                                  )}
                                              </>
                                          )}
                                      </div>
                                      <form method="post">
                                          <div className="row">
                                              <div className="col">
                                                  <label className="link form-control text-center" role="button">
                                                      <input
                                                          type="file"
                                                          name="myFile"
                                                          accept=".pdf"
                                                          onChange={(e) => handleFileUpload(e)}
                                                      />
                                                      <span className="text-center">Carga tu documento <i
                                                          className="fas fa-regular fa-upload"></i></span>
                                                  </label>
                                              </div>
                                          </div>
                                      </form>
                                  </div>
                              </section>
                          </div>
                      </main>
                      {process.env.REACT_APP_Theme === 'FirmaSeguro' ? (
                          <footer>
                              <p className="text-center" translate="no">
                                  Copyright <a href="http://tredasolutions.com/" >Treda Solutions</a>
                              </p>

                              <a href="mailto:soporte@firmaseguro.co">
                                  <i className="far fa-envelope"></i>
                                  soporte@firmaseguro.co
                              </a>
                          </footer>
                      ): null }
                  </div>
          </div>
                </div>
          </ThemeSelector>
      </React.Fragment>
  );
}

export default App;
