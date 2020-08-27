import React, { useState, useEffect } from 'react'
import moment from 'moment'

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'

import MultiSelect from "react-multi-select-component";

import swal from 'sweetalert'

import LoadDevices from './services/LoadDevices'
import ApiLog from './services/ApiLog'
import ApiAnalytics from './services/ApiAnalytics'

const App = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [devices, setDevices] = useState([])
    const [informationLog, setInformationLog] = useState({information: [], seconds: 0})
    const [informationAnalytics, setInformationAnalytics] = useState([])

    const [devicesSelected, setDevicesSelected] = useState([])
    const [inputDate, setInputDate] = useState('')
    const [isSearching, setIsSearching] = useState(false)
     
    const loadDevices = async () => {

        setIsLoading(true)

        const devicesLoaded = await LoadDevices()
        
        const formatted = []
        devicesLoaded.forEach(device => {
            if (device){   
                formatted.push({label: device.name, value: device.id})
            }
        })
        
        setDevices(formatted)
        setIsLoading(false)
    }

    useEffect(() => {

        loadDevices()

    }, [])

    return (

        <div>

        <Container>
            <br />
            <Card>
                <Card.Header>Filtros</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Dispositivo(s)</Form.Label>
                                <MultiSelect
                                        options={devices}
                                        value={devicesSelected}
                                        onChange={setDevicesSelected}
                                        labelledBy={"SELECIONE O(s) DISPOSITIVO(s)"}
                                        hasSelectAll={false}
                                        isLoading={isLoading}
                                    />
                                            
                              
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Data</Form.Label>
                                <Form.Control size="lg" type="date" value={inputDate} onChange={({target}) => {
                                    setInputDate(target.value)
                                } }/>
                            </Form.Group>


                        </Form.Row>
                    </Form>
                    <Button variant="primary" onClick={ async () => {

                        if (isSearching){
                            swal('Oops', 'Waiting...', 'warning')
                            return
                        }

                        if (devicesSelected.length < 0){
                            swal('Oops', 'Informe um ID válido', 'warning')
                            return
                        }

                        if (!inputDate){
                            swal('Oops', 'Informe uma data válida', 'warning')
                            return
                        }

                        setIsSearching(true)

                        const idDevices = devicesSelected.map(d => d.value)
                        
                        const informationApiLog = await ApiLog.getInformationPackets(idDevices, inputDate)
                        console.log('information api log', informationApiLog)       
                        
                        const informationApiAnalytics = await ApiAnalytics.getInformationPackets(idDevices, inputDate)
                        console.log('information api analytics', informationApiAnalytics)       

                        setInformationLog(informationApiLog)
                        setInformationAnalytics(informationApiAnalytics)

                        setIsSearching(false)

                    }}>Buscar informações</Button>

                </Card.Body>
            </Card>
            <br />

        </Container>
        <br/>

        <Container fluid>

        <Card>
                <Card.Header>Informações</Card.Header>
                <Card.Body> <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Device</th>
                    <th>Total Packets</th>
                    <th>Total Packet Loss - (Recovered)</th>
                    <th>% Received</th>
                    <th>Counter Recovered</th>
                    <th>First Packet</th>
                    <th>Last Packet</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        informationLog.information.map((info, index) => {
                            return ( 
                                <tr key={index}> 
                                <td> 
                                    {
                                      (devices && devices.length) ? `${info.id} - ${devices.find(d => d.value == info.id).label}` : ''
                                    }
                                </td>
                                <td>
                                    {info.totalPacket}
                                </td>
                                <td>
                                    {info.totalPacketLoss}
                                </td>

                                <td>
                                    {parseInt((info.totalPacket / informationLog.totalSeconds) * 100)}%
                                </td>

                                <td>

                                    {
                                       (informationAnalytics && informationAnalytics.length) ? informationAnalytics.find(i => i.id === info.id).counterPacketLoss : '...'
                                    }

                                </td>

                                <td>

                                    <Accordion defaultActiveKey="0">
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        View packet ( API LOG )
                                    </Accordion.Toggle>
                                
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body className="text-justify">
                                        <pre>
                                        { JSON.stringify(info.firstLog, undefined, 2) }
                                        </pre>
                                        
                                        </Card.Body>
                                    </Accordion.Collapse>
                                    </Accordion>
                                    
                                </td>
                                
                                <td>

                                <Accordion defaultActiveKey="0">
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        View packet ( API LOG )
                                    </Accordion.Toggle>
                                
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body className="text-justify">
                                        <pre>
                                        { JSON.stringify(info.lastLog, undefined, 2) }
                                        </pre>
                                        
                                        </Card.Body>
                                    </Accordion.Collapse>
                                    </Accordion>
                                    
                                </td>
                          
                                </tr>
                            )
                        })
                    }
                
                </tbody>
                </Table>



                </Card.Body>
            </Card>
       

        </Container>
       

     </div>

        
    )
}

export default App