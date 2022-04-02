const _eventMap = {};

export default class MsuiEventCenter {

    static publish(eventName, eventObj) {
        if (!eventName || !eventObj)
            return;
        if (!_eventMap[eventName]) {
            _eventMap[eventName] = [eventObj]
        } else {
            _eventMap[eventName].push(eventObj);
        }
    }


    static subscribe(eventName, param) {
        if (!eventName)
            return;
        let curEvent = _eventMap[eventName];
        if (!curEvent)
            return;

        curEvent.forEach(cur => {
            cur[eventName](param);
        });
    }

}