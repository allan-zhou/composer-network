'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * 交易商品
 * @param {com.yiqishanyuan.demo.tradeCommodity} tx buyser|commodity
 * @transaction
 */
function tradeCommodity(tx) {
    
    var oldUserName = tx.commodity.owner.userName;

    tx.commodity.owner = tx.buyer;

    return getAssetRegistry('com.yiqishanyuan.demo.Commodity')
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.commodity);
        })
        .then(function () {
            var factory = getFactory();

            var event = factory.newEvent('com.yiqishanyuan.demo','tradeCommodityEvent');
            event.commodity = tx.commodity;
            event.oldUserName = oldUserName ;
            event.newUserName =  tx.buyer.userName;
            
            emit(event);
        })
}