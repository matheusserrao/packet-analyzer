import axios from 'axios'

const getInformationPackets =  async (idDevice, date) => {
    return await axios
                        .get(`http://flex.grupoicts.com.br/analytics/energy/packetloss/device/${idDevice}/${date}`)
                        .then(response => {
                            return response.data
                        })
}

export default {
    getInformationPackets
}