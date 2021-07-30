const net = require('net');

const server = net.createServer(scoket => {
    console.log('client connected');
    // 接收数据时发出
    scoket.on('data', data => {
        console.log('server get client message : ', data.toString());
        scoket.write('this is server')
    })

    scoket.on('close',()=>{
        console.log('client is close');
    })
})

server.listen(8124, () => {
    console.log('server is runner')
})