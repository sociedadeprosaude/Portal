<template>
    <v-container fluid class="card-main fill-height">
        <v-layout class="card-row">
            <v-card-text class="card-colum">
                <v-card-text class="card-group">
                    <v-img
                            :src="require('@/assets/clinica.png')"
                            aspect-radio="1"
                            width="160"
                            class="image"
                    ></v-img>
                    <v-btn class="buttom" color="#4169E1" @click="clinicas" dark>Clinicas</v-btn>
                </v-card-text>
                <v-card-text class="card-group">
                    <v-img
                            :src="require('@/assets/exame.jpg')"
                            aspect-radio="1"
                            width="160"
                            class="image"
                    ></v-img>
                    <v-btn class="buttom" color="#4169E1" @click="exames" dark>Exames</v-btn>
                </v-card-text>
            </v-card-text>
            <v-card-text class="card-colum">
                <v-card-text class="card-group">
                    <v-img
                            :src="require('@/assets/consulta.png')"
                            aspect-radio="1"
                            width="160"
                            class="image"
                    ></v-img>
                    <v-btn class="buttom" color="#4169E1"  @click="consultas" dark>Consultas</v-btn>
                </v-card-text>
                <v-card-text class="card-group">
                    <v-img
                        :src="require('@/assets/pacote.png')"
                        aspect-radio="1"
                        width="160"
                        class="image"
                    ></v-img>
                    <v-btn class="buttom" color="#4169E1" @click="pacotes" dark>Pacotes</v-btn>
                </v-card-text>

            </v-card-text>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: () =>({


        }),
        methods:{
            oi(){
                this.$router.push('/')
            },
            clinicas(){
                this.$router.push('/Clinics')
            },
            consultas(){
                this.$router.push('/Consultas')
            },
            exames(){
                this.$router.push('/Exams')
            },
            pacotes () {
                this.$router.push('/Bundles')
            },
        }
    }

</script>

<style>

    .card-main {
        background: #B0C4DE;
    }
    .card-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: #B0C4DE;
        width: 60%;
        border-radius: 40px;
        margin: auto;

    }

    .card-colum {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto;
    }
    .buttom{

        width: 200px;
        border-radius: 10px;
        margin-top: 10px;
        color: #4169E1;
    }

    .image{

        border-radius: 100px;
    }
    .card{
        padding-top:5%;
        font-size: 35px;
        margin-left: 30%;
        margin-top: 40%;
        width: 200px;
        height: 170px;
        display: flex;
        flex-direction: column;
        justify-items: center;
        align-content: center;
    }
</style>
