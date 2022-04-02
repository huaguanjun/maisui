<template>
    <el-input
        ref="input"
        v-model="val"
        :type="attrs.type || 'text'"
        :maxlength="attrs.maxLength || null"
        :minlength="attrs.minLength || null"
        :show-word-limit="attrs.showWordLimit || false"
        :clearable="attrs.clearable || true"
        :showPassword="attrs.showPassword || false"
        :disabled="attrs.disabled || false"
        :size="attrs.size || null"
        :prefixIcon="attrs.prefixIcon || null"
        :suffixIcon="attrs.suffixIcon || null"
        :rows="attrs.rows || 2"
        :autosize="attrs.autosize || false"
        :autocomplete="attrs.autocomplete || 'off'"
        :name="attrs.name || null"
        :readonly="attrs.readonly || false"
        :max="attrs.max || null"
        :min="attrs.min || null"
        :step="attrs.step || null"
        :resize="attrs.resize || null"
        :autofocus="attrs.autofocus || false"
        :form="attrs.form || null"
        :label="attrs.label || null"
        :tabindex="attrs.tabindex || null"
        :validateEvent="attrs.validateEvent || true"
        :placeholder="attrs.placeholder || '请输入'"
        @blur="blur"
        @focus="focus"
        @change="change"
        @input="input"
        @clear="clear"
        />
</template>

<script>
export default {
    name: 'MsuiInput',
    props: {
        attrs: {
            type : Object,
            default: () => {
                return {}
            }
        },
        value: {
            default : ''
        }
    },
    // mounted() {
    //     console.log(this.attrs)
    // },
    computed: {
        val: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods:{
        blur() {
            this.$emit('blur')
            if(this.attrs.blur) {
                this.attrs.blur()
            }
        },
        focus() {
            this.$emit('focus')
            if(this.attrs.focus) {
                this.attrs.focus()
            }
        },
        change() {
            this.$emit('change')
            if(this.attrs.change) {
                this.attrs.change()
            }
        },
        input(val) {
            this.$emit('input', val)
            if(this.attrs.input) {
                this.attrs.input(val)
            }
        },
        clear() {
            this.$emit('clear')
            if(this.attrs.clear) {
                this.attrs.clear()
            }
        }
    }
}
</script>

