<template>
    <v-container>
        <NewUsersReport
                :search="search"
                :now="now"
                :total="total"
                :options="options"
                :optionSelected="optionSelected"
                :headers="headers"
                :actualList="actualList"
                :newUsers="newUsers"
                :numNewUsers="numNewUsers"

                @change-optionSelected="changeOption(value)"
                @change-search="(value)=>search=value"
        />
    </v-container>
</template>

<script>
    import moment from "moment";
    import NewUsersReport from "@/components/Reports/NewUsersReport";

    export default {
        // name: "NewUsersReport",
        components: {NewUsersReport},
        props: ["date", "date2", "todayNewUsers"],
        data() {
            return {
                search: "",
                now: moment().format("YYYY-MM-DD HH:mm:ss"),
                total: 0,
                options: ["Hoje", "Intervalo de dias"],
                optionSelected: 0,
                headers: [
                    {
                        text: "CPF",
                        align: "start",
                        sortable: false,
                        value: "cpf"
                    },
                    {text: "Nome", value: "name", align: "center"},

                    {
                        text: "Número de associado",
                        value: "_id",
                        align: "center"
                    }
                ],

                dateBegin: null,
                dateEnd: null
            };
        },
        mounted() {
        },
        methods: {
            changeOption (value) {
                this.optionSelected=value;
            }
        },
        computed: {
            actualList() {
                return this.optionSelected === 0 ? this.todayNewUsers : this.newUsers;
            },
            newUsers() {
                return this.$store.getters.users;
            },
            numNewUsers() {
                if (this.actualList) return this.actualList.length;
                return 0;
            }
        },
    };
</script>

<style scoped>
    .subTable {
        border-radius: 0px;
        border: 1px solid black;
    }
</style>