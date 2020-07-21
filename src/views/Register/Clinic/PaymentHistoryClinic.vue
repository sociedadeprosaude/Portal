<template>
        <template-payment-history-clinic :outtakes-filter="outtakesFilter" @filter="filter = $event" :dats="dats" :clinic="clinic" :quant-tot="QuantTot" :price-tot="PriceTot" :outtakes="outtakes" ></template-payment-history-clinic>
</template>


<script>
    import {mask} from "vue-the-mask";
    import moment from "moment";
    import TemplatePaymentHistoryClinic from '../../../components/clinics/PaymentHistoryClinic/TemplatePaymentHistoryClinic'

    export default {
        name: "PaymentHistoryClinic",
        directives: {
            mask
        },
        components:{TemplatePaymentHistoryClinic},
        data() {
            return {
                clinic:[],
                filter:'',
            };
        },
        async mounted(){
            await  this.InitialConfig()
        },
        methods: {
            day(i){
               return  moment(i).format('DD/MM/YYYY')
            },
            async InitialConfig(){
                this.clinic = await this.$store.dispatch('getClinic',this.user.cnpj)
                await this.$store.dispatch('GetAllReceiptsPaidClinic',this.clinic)
            },
        },
        computed:{
            user() {
                return this.$store.getters.user
            },
            outtakes(){
                return this.$store.getters.PaidOuttakesExamsClinics
            },
            dats(){
                let datas = []
                for( let outtake in this.outtakes){
                    datas.push( moment(outtake).format('DD/MM/YYYY'))
                }
                return datas
            },
            PriceTot(){
                let cost =0;
                for(let day in this.outtakes){
                    let outtakesDay = this.outtakes[day].outtakes
                    outtakesDay.filter(function (element) {
                        element.exams.filter(function (element2) {
                            cost += element2.price
                        })
                    })
                }
                return cost
            },
            QuantTot(){
                let quant =0;
                for(let day in this.outtakes){
                    let outtakesDay = this.outtakes[day].outtakes
                    outtakesDay.filter(function (element) {
                        element.exams.filter(function (element2) {
                            quant +=1
                        })
                    })
                }
                return quant
            },
            outtakesFilter(){
                let outakes={}
                let cont =0
                for( let outtake in this.outtakes){
                    if(moment(outtake).format('DD/MM/YYYY') === this.filter) {
                        cont += 1
                        outakes[outtake] = {
                            outtakes: []
                        }
                        outakes[outtake].outtakes = this.outtakes[outtake].outtakes
                        return outakes
                    }
                }
                if(cont === 0){
                    return this.outtakes
                }
            }
        }
    };
</script>
