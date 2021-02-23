<template>
        <template-verification-forwarding-billing :clinic="clinic" :quant-tot="QuantTot" :price-tot="PriceTot" :outtakes="outtakes"  ></template-verification-forwarding-billing>
</template>


<script>
    import {mask} from "vue-the-mask";
    import TemplateVerificationForwardingBilling from '../../../components/clinics/TemplateVerificationForwardingBilling'

    export default {
        name: "VerificationForwardingBilling",
        directives: {
            mask
        },
        components:{TemplateVerificationForwardingBilling},
        data() {
            return {
                numberIntake:'',
                clinic:[],
            };
        },
        async mounted(){
            await  this.InitialConfig()
        },
        methods: {
            async InitialConfig(){
                this.clinic = await this.$store.dispatch('getClinic',this.user.cnpj)
                await this.$store.dispatch('GetReceiptsClinic',this.clinic)
            },
        },
        computed:{
            user() {
                return this.$store.getters.user
            },
            outtakes(){
                return this.$store.getters.IntakesExamsClinics
            },
            PriceTot(){
                let cost =0;
                this.outtakes.filter(function (element){
                    element.exams.filter(function (element2) {
                        cost += element2.price
                    })
                })
                return cost
            },
            QuantTot(){
                let quant =0;
                this.outtakes.filter(function (element){
                    element.exams.filter(function () {
                        quant += 1
                    })
                })
                return quant
            }
        }
    };
</script>
