const net = require('net');

const client = net.createConnection({port:8124},()=>{
    console.log('connected to server!');
})
// 接收数据时发出
client.on('data',data=>{
    console.log('client get server message : ',data.toString());
})
// 发送数据包,并关闭连接
client.end('this is client');

client.on('close',()=>{
    console.log('client is close');
})