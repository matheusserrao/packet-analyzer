import axios from 'axios'

const getInformationPackets =  async (idDevices, date) => {
    return await axios.post(`https://flex.grupoicts.com.br/analytics/energy/packetloss/device`, {idDevices, date})
                        .then(response => {
                            return response.data
                        })
}

export default {
    getInformationPackets
}