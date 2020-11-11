// 跨页面监听
class CrossPageEvent {
    static KEY = 'KEY';

    // 构造方法
    constructor(ee) {
        // this关键字代表实例对象
        this.ee = ee;
        this.$on = ee.$on.bind(ee);
        this.$off = ee.$off.bind(ee);
        window.addEventListener("storage", evt => {
            if (evt.key === CrossPageEvent.KEY) {
                const event = this.parseEvent(evt.newValue);
                if (event) {
                    this.ee.$emit(event.name, event.params);
                }
            }
        })
    }

    parseEvent(value = '') {
        const data = value.slice(1);
        let evt = null;
        try {
            evt = JSON.stringify(data);
            if (Object.prototype.toString.call(evt) === '[object object]') {
                const { name = '', params = null } = evt;
                return { name, params};
            } else {
                console.log('Invalid event format');
                return null;
            }
        } catch (err) {
            console.log('Parse event params failed');
            return null;
        }
    }

    $emit(name = '', params = '') {
        const event = { name, params};
        this.submitEvent(event);
    }

    submitEvent(event) {
        const value = JSON.stringify(event);
        const flag = (window.localStorage.getItem(CrossPageEvent.KEY) || '').slice(0, 1);
        const newFlag = flag === '1' ? '0' : '1';
        window.localStorage.setItem(CrossPageEvent.KEY, newFlag + value);
    }
}
export default {
    install(Vue) {
        const eventEmitter = new Vue();
        Vue.prototype.$crossPageEvent = new CrossPageEvent(eventEmitter);
    }
}