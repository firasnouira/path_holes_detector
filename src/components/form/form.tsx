import './form.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


function MapForm() {

  return (
    <>
       <Form>
      <Row>
        <Col>
        <Form.Label>Email</Form.Label>
          <Form.Control required />
        </Col>
        <Col>
        <Form.Label>Email2</Form.Label>
          <Form.Control  required/>
        </Col>
      </Row>
    </Form>

    </>
  )

}
export default MapForm;