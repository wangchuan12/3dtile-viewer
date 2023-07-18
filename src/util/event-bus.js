export default class EventBus{
    constructor(){
        this.eventMap = new Map()
    }

    /**
     * 
     * @param {string} name 
     * @param {Function} callBack 
     */
    on(name , callBack){
        if (this.eventMap.has(name)) {
            this.eventMap.get(name).push({
                callBack
            })
            return
        } 

        this.eventMap.set(name , [
            {
                callBack
            }
        ])
    }

    emit(name , ...data){
        if (this.eventMap.has(name)) {
            this.eventMap.get(name).forEach((item)=>{
                item.callBack(...data)
            })
            return
        }

        console.log(`事件${name}未注册`)
        return 
    }

    detach(name , callBack){
        const item = this.eventMap.get(name)
        if (item) {
            const index = item.findIndex((fe)=>{
                if (fe.callBack === callBack) return true
                return false
            })

            if (index !== -1) {
                this.eventMap.set(name , item.splice(index , 1))
            }
        }
    }

}