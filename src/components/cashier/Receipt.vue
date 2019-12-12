<template>
    <v-container fluid class="fill-height">
        <v-layout row wrap>
            <v-flex>
                <v-card>
                    <v-container>
                        <v-flex>
                            <span class="headline font-weight-regular">Recibo</span>
                        </v-flex>
                        <v-flex>
                            <span>Código: this.codigo</span>
                        </v-flex>
                        <v-flex>
                            <p>Recebemos de 'Nome do paciente' a quantia de R$!!this.total!! correspondente ao pagamento de this.budgets.exams.length>0?'exames, ':''}}
                                this.budgets.specialties.length >0?'consultas, ':''}} e para a clareza firmamos o presente.
                            </p>
                        </v-flex>
                        <v-btn @click="mostrar()"></v-btn>
                        <v-flex>
                            <p class="text-right">
                                Manaus,{{this.data3}}
                            </p>
                        </v-flex>

                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

export default{
    name:"Receipt",
    props: ['budgets'],
    data: ()=>({
        codigo:'',
        data3:'',
        recibo:'',
    }),
    methods: {
        mostrar(){
            console.log(this.budgets)
        }

    }
}
</script>