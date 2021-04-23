import React from "react"
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Alert
} from "reactstrap"

import useLoginForm from './Admin/customHooks/useLoginForm'
import { auth } from 'config'
import LoadingCog from "components/LoadingCog"
import AdminHelmet from "components/Helmet/AdminHelmet"

function LoginPage(props) {
  const [firstFocus, setFirstFocus] = React.useState(false)
  const [lastFocus, setLastFocus] = React.useState(false)
  const [, setIsAuthenticated] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [loaded, setLoaded] = React.useState(true)
  const [visible, setVisible] = React.useState(true)

  const login = async () => {
    setLoaded(false)
    setVisible(true)

    const { email, password } = inputs
    try {
      // const res = await auth.signInWithEmailAndPassword(email, password)
      await auth.signInWithEmailAndPassword(email, password)
      setIsAuthenticated(true)
      return props.history.push("/admin")

    } catch (err) {
      setError(true)
      setLoaded(true)
    }
  }

  const { inputs, handleInputChange, handleSubmit } = useLoginForm({ email: "", password: "" }, login)

  React.useEffect(() => {

    document.body.classList.add("login-page")
    document.body.classList.add("sidebar-collapse")
    document.documentElement.classList.remove("nav-open")
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
    return function cleanup() {
      document.body.classList.remove("login-page")
      document.body.classList.remove("sidebar-collapse")
    }
  })

  return (
    <>
      <AdminHelmet title="Login" />

      <div className="page-header clear-filter" filter-color="green">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/burlemarx.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="4">
              <Card className="card-login card-plain">
                <Form onSubmit={handleSubmit}>
                  <CardHeader className="text-center pt-4">
                    <h4 className="text-center text-uppercase">administrativo</h4>
                    <div className="logo-container" style={{ marginTop: "55px" }}>
                      {/* <img className="bg-white" src={image} alt="Jardim Interativo" /> */}

                      {/* <img
                        alt="Logo"
                        // src={require("assets/img/plantIcon.svg")}
                        src={require("assets/img/plantIcon.svg")}
                      /> */}
                    </div>

                  </CardHeader>
                  {!loaded && (<LoadingCog />)}
                  {error && (
                    <Alert color="danger" isOpen={visible} toggle={() => setVisible(!visible)}>
                      Senha ou E-mail inválidos
                    </Alert>
                  )}

                  <CardBody className="pb-0">
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (firstFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_email-85"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email..."
                        onChange={handleInputChange}
                        required
                        value={inputs.email}
                        name="email"
                        type="text"
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                      ></Input>
                    </InputGroup>
                    <InputGroup
                      className={
                        "no-border input-lg" +
                        (lastFocus ? " input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-key"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Senha..."
                        onChange={handleInputChange}
                        required
                        value={inputs.password}
                        name="password"
                        type="password"
                        onFocus={() => setLastFocus(true)}
                        onBlur={() => setLastFocus(false)}
                      ></Input>
                    </InputGroup>
                  </CardBody>
                  <CardFooter className="text-center">
                    <Button
                      block
                      type="submit"
                      className="btn-round"
                      color="info"
                      size="lg"
                    >
                      Logar
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
      </div>
    </>
  )
}

export default LoginPage
