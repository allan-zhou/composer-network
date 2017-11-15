# com.yiqishanyuan.demo


## downloadFabric.sh
docker pull hyperledger/fabric-peer:$ARCH-1.0.4      // peer节点镜像
docker pull hyperledger/fabric-ca:$ARCH-1.0.4        // fabric-ca镜像

// 支持Go语言的链码基础镜像，其中安装了chaintool、Go语言的链码shim层。在链码容器生成过程中作为编译环境将链码编译为二进制文件，
// 供链码容器使用，方便保持链码容器自身的轻量化
docker pull hyperledger/fabric-ccenv:$ARCH-1.0.4	 
docker pull hyperledger/fabric-orderer:$ARCH-1.0.4
docker pull hyperledger/fabric-couchdb:$ARCH-1.0.4

## startFabric.sh
### Create the channel
docker exec peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c composerchannel -f /etc/hyperledger/configtx/composer-channel.tx

peer channel create
-o // 配置orderer
-c // chainID
-f // 配置交易文件路径

### Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b composerchannel.block
peer channel join
-b //区块文件路径

## createPeerAdminCard.sh
composer card create -p /tmp/.connection.json -u PeerAdmin -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin -r ChannelAdmin --file /tmp/PeerAdmin@hlfv1.card

## composer archive/runtime/card/network 
composer archive create -a dist/shanyuan-network@0.0.1.bna -t dir -n .
composer archive list -a dist/shanyuan-network@0.0.1.bna

composer runtime install --c PeerAdmin@hlfv1 --n shanyuan-network
composer network start -c PeerAdmin@hlfv1 -A admin -S adminpw -a dist/shanyuan-network@0.0.1.bna -f dist/networkadmin.card
composer card import -f dist/networkadmin.card
composer network ping -c admin@shanyuan-network
composer network list -c admin@shanyuan-network
composer network update -a dist/shanyuan-network@0.0.5.bna -c admin@shanyuan-network

## composer-rest-server
composer-rest-server -c admin@shanyuan-network -n never
