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

import swal from 'sweetalert'

import LoadDevices from './services/LoadDevices'
import ApiLog from './services/ApiLog'
import ApiAnalytics from './services/ApiAnalytics'

const App = () => {

    const [devices, setDevices] = useState([])

    const [totalPacketsApiLog, setTotalPacketsApiLog] = useState(0)
    const [totalPacketsLossApiLog, setTotalPacketsLossApiLog] = useState(0)
    const [percentTotalPacketsReceivedApiLog, setPercentTotalPacketsReceivedApiLog] = useState(0)
    const [percentTotalPacketsLossApiLog, setPercentTotalPacketsLossApiLog] = useState(0)
    const [firstDatePacketApiLog, setFirstDatePacketApiLog] = useState('')
    const [lastDatePacketApiLog, setLastDatePacketApiLog] = useState('')
    const [firstPacketApiLog, setFirstPacketApiLog] = useState({})
    const [lastPacketApiLog, setLastPacketApiLog] = useState({})

    const [totalPacketsApiAnalytics, setTotalPacketsApiAnalytics] = useState(0)
    const [totalPacketsLossApiAnalytics, setTotalPacketsLossApiAnalytics] = useState(0)
    const [percentTotalPacketsLossApiAnalytics, setPercentTotalPacketsLossApiAnalytics] = useState(0)
    const [percentTotalPacketsReceivedApiAnalytics, setPercentTotalPacketsReceivedApiAnalytics] = useState(0)
    const [counterPacketLossApiAnalytics, setCounterPacketLossApiAnalytics] = useState(0)
    const [firstDatePacketApiAnalytics, setFirstDatePacketApiAnalytics] = useState('')
    const [lastDatePacketApiAnalytics, setLastDatePacketApiAnalytics] = useState('')


    const [onlineApiAnalytics, setOnlineApiAnalytics] = useState(0)

    const [idDeviceSelected, setIdDeviceSelected] = useState(-1)
    const [inputDate, setInputDate] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const loadDevices = async () => {
        const devicesLoaded = await LoadDevices()
        setDevices(devicesLoaded)
    }

    useEffect(() => {

        loadDevices()

    }, [])

    return (

        <Container >
            <br />
            <Card>
                <Card.Header>Filtros</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Dispositivo(s)</Form.Label>
                                <Form.Control size="lg" as="select"  defaultValue="-1" value={idDeviceSelected} onChange={({target}) => setIdDeviceSelected(target.value) }>
                                    {
                                        devices.length && devices.map((d, i) => {
                                            if (d) {
                                                return <option key={i} value={d.id}>{d.id} - {d.name}</option>
                                            }
                                        })
                                    }
                                    {
                                        <option key={'default'} value='-1'>...</option>
                                    }
                                </Form.Control>
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
                            return
                        }

                        setIsSearching(true)

                        if (idDeviceSelected < 0){
                            swal('Oops', 'Informe um ID válido', 'warning')
                            return
                        }

                        if (!inputDate){
                            swal('Oops', 'Informe uma data válida', 'warning')
                            return
                        }

                        console.log('id selected:' + idDeviceSelected)
                        console.log('date selected: ' + inputDate)

                        // API LOGS
                        const informationApiLog = await ApiLog.getInformationPackets(idDeviceSelected, inputDate)
                        console.log('information api log', informationApiLog)

                        const percentTotalPacketsReceivedApiLog = parseInt((informationApiLog.totalPackets / 84600) * 100)
                        const percentTotalPacketsLossApiLog = parseInt((informationApiLog.totalPacketsLoss / 84600) * 100)

                        setPercentTotalPacketsReceivedApiLog(percentTotalPacketsReceivedApiLog)
                        setPercentTotalPacketsLossApiLog(percentTotalPacketsLossApiLog)
                        setTotalPacketsApiLog(informationApiLog.totalPackets)
                        setTotalPacketsLossApiLog(informationApiLog.totalPacketsLoss)
               
                        if (informationApiLog.firstLog && informationApiLog.firstLog.length){

                            const [ firstLog ] = informationApiLog.firstLog
                            setFirstPacketApiLog(firstLog)
                            setFirstDatePacketApiLog(firstLog.date)

                        }else{
                            setFirstPacketApiLog('-')
                            setFirstDatePacketApiLog('-')
                        }

                        if (informationApiLog.lastLog && informationApiLog.lastLog.length){

                            const [ lastLog ] = informationApiLog.lastLog
                            setLastPacketApiLog(lastLog)
                            setLastDatePacketApiLog(lastLog.date)

                        }else{
                            setLastPacketApiLog('-')
                            setLastDatePacketApiLog('-')
                        }

                        // API ANALYTICS
                        const informationApiAnalytics = await ApiAnalytics.getInformationPackets(idDeviceSelected, inputDate)
                        console.log('information api analytics', informationApiAnalytics)

                        const startDate = moment.utc(informationApiAnalytics.firstDate)
                        const endDate   = moment.utc(informationApiAnalytics.lastDate).endOf('day')

                        const diff = endDate.diff(startDate)

                        const duration = moment.duration(diff)
                        const totalSeconds = duration.asSeconds() || 84600
                        
                        console.log('total seconds', totalSeconds)

                        const percentTotalPacketsReceivedApiAnalytics = parseInt((informationApiAnalytics.totalPackets / totalSeconds) * 100)
                        const percentTotalPacketsLossApiAnalytics = parseInt((informationApiAnalytics.packetLoss / totalSeconds) * 100)

                        setTotalPacketsApiAnalytics(informationApiAnalytics.totalPackets)
                        setTotalPacketsLossApiAnalytics(informationApiAnalytics.packetLoss)
                        setPercentTotalPacketsReceivedApiAnalytics(percentTotalPacketsReceivedApiAnalytics)
                        setPercentTotalPacketsLossApiAnalytics(percentTotalPacketsLossApiAnalytics)
                        setCounterPacketLossApiAnalytics(informationApiAnalytics.counterPacketLoss)
                        setFirstDatePacketApiAnalytics(informationApiAnalytics.firstDate)
                        setLastDatePacketApiAnalytics(informationApiAnalytics.lastDate)

                        setOnlineApiAnalytics(informationApiAnalytics.online)                     
                        
                        setIsSearching(false)

                    }}>Buscar informações</Button>

                </Card.Body>
            </Card>
            <br />

            <Card>
                <Card.Header>Informações</Card.Header>
                <Card.Body>

                    <CardGroup className="text-center">
                        <Card>
                            <Card.Body >
                                <Card.Title><strong>Total Packets</strong></Card.Title>
                                <Card.Text>
                                    API Log: <label style={{color: 'red'}}>{totalPacketsApiLog}</label> |  <label style={{color: 'green'}}>{percentTotalPacketsReceivedApiLog}%</label> recebido
                                    <br/>
                                    API Analytics: <label style={{color: 'red'}}>{totalPacketsApiAnalytics}</label> |  <label style={{color: 'green'}}>{percentTotalPacketsReceivedApiAnalytics}%</label> recebido
                         
                        </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Total per day: 84600 | Api Analytics: current > 0.05</small>
                            </Card.Footer>
                        </Card>

                        <Card>
                            <Card.Body>
                                <Card.Title><strong>Total Packet Loss - (Recovered)</strong></Card.Title>
                                <Card.Text>
                                    API Log: <label style={{color: 'red'}}>{totalPacketsLossApiLog}</label> |  <label style={{color: 'green'}}>{percentTotalPacketsLossApiLog}%</label> Recovered
                                    <br/>
                                    API Analytics: <label style={{color: 'red'}}>{totalPacketsLossApiAnalytics}</label> |  <label style={{color: 'green'}}>{percentTotalPacketsLossApiAnalytics}%</label> Recovered
                         
                        </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Energy</small>
                            </Card.Footer>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title><strong>Counter Packet Loss - (Recovered)</strong></Card.Title>
                                <Card.Text>
                                    
                                API Analytics: <label style={{color: 'red'}}>{counterPacketLossApiAnalytics}</label> 

                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Energy</small>
                            </Card.Footer>
                        </Card>


                    </CardGroup>
                    <br />

                    <CardGroup className="text-center">
                       
                        <Card>

                            <Card.Body>
                                <Card.Title><strong>First Packet</strong></Card.Title>

                                <Card.Text>
                                    API Log: <label style={{color: 'red'}}>{firstDatePacketApiLog}</label> 
                                    <br/>
                                    API Analytics: <label style={{color: 'green'}}>{firstDatePacketApiAnalytics}</label> 
                                </Card.Text>

                                <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    View packet ( API LOG )
                                </Accordion.Toggle>
                               
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body className="text-justify">
                                    <pre>
                                    { JSON.stringify(firstPacketApiLog,undefined, 2) }
                                    </pre>
                                       
                                    </Card.Body>
                                </Accordion.Collapse>
                                </Accordion>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Energy</small>
                            </Card.Footer>
                        </Card>
                      

                        <Card>
                            <Card.Body>
                                <Card.Title><strong>Last Packet</strong></Card.Title>
                              
                                <Card.Text>
                                    API Log: <label style={{color: 'red'}}>{lastDatePacketApiLog}</label> 
                                    <br/>
                                    API Analytics: <label style={{color: 'green'}}>{lastDatePacketApiAnalytics}</label> 
                                </Card.Text>

                                <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    View packet ( API LOG )
                                </Accordion.Toggle>
                               
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body className="text-justify">
                                    <pre>
                                    { JSON.stringify(lastPacketApiLog,undefined, 2) }
                                    </pre>
                                       
                                    </Card.Body>
                                </Accordion.Collapse>
                                </Accordion>

                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Energy</small>
                            </Card.Footer>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Card.Title><strong>Online</strong></Card.Title>
                                <Card.Text>
                                    {onlineApiAnalytics} hours
                        </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">Api Analytics | current > 0.05</small>
                            </Card.Footer>
                        </Card>

                    </CardGroup>

                </Card.Body>
            </Card>
            <br/>
            <label>Versão 1.0.0</label>
        </Container>
    )
}

export default App