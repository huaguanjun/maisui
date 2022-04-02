class MsuiElement {
    constructor() {
        this.template = ''
        this.watch = {}
        this.methods = {}
        this.computed = {}
        this.data = {}
        this.filters = {}
        this.mounted = null
    }   
    render(el) {
        let msuiVM = MsuiElement.Vue.extend({
            mounted: this.mounted,
            template: this.template,
            filters: this.filters,
            methods: this.methods,
            data: () => { return this.data },
            watch: this.watch,
            computed: this.computed
        })
        this.MSUIVUEINS = new msuiVM().$mount(el)

       if(process.env === 'production') {
          delete this.template
       } else {
          delete this.template
       }

       return this
    }
}

export default MsuiElement