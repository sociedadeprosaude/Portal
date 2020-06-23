<template>
    <v-content>
        <v-container fluid>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            Tabela Semanal dos Médicos - Especialidades - Unidades:
                            <v-divider vertical class="mx-4" inset>
                            </v-divider>
                            <v-chip label dark color="primary">
                                Médico - Especialidade - Unidade
                            </v-chip>
                            <v-spacer/>
                            <!-- <v-text-field v-model="search" append-icon="search" label="Search" single-line
                                          hide-details/> -->
                            <v-layout class="mt-5" row wrap>
                                <v-flex class="mr-5" xs12 sm5 md4>
                                    <v-combobox
                                    label="Especialidade"
                                    prepend-icon="school"
                                    v-model="specialty"
                                    :items="specialties"
                                    item-text="name"
                                    return-object
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="pink"
                                    clearable
                                    dense
                                    >
                                    <template v-slot:selection="data">
                                        <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :input-value="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                        >{{ data.item.name }}</v-chip>
                                    </template>
                                    </v-combobox>
                                </v-flex>
                                <v-flex xs12 sm5 md4>
                                    <v-combobox
                                    prepend-icon="account_circle"
                                    v-model="doctor"
                                    :items="doctors"
                                    item-text="name"
                                    return-object
                                    label="Médico"
                                    no-data-text="Nenhum médico para esta especialidade"
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="purple"
                                    clearable
                                    dense
                                    >
                                    <template v-slot:selection="data">
                                        <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :input-value="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                        >{{ data.item.name }}</v-chip>
                                    </template>
                                    </v-combobox>
                                </v-flex>
                            </v-layout>
                        </v-card-title>
                        <v-data-table
                                hide-default-header
                                hide-default-footer
                                :headers="headers"
                                :items="doctorsMapping"
                                :items-per-page="-1"
                                item-key="hour"
                                class="elevation-1"
                        >

                            <template v-slot:header="{}">
                                <thead>
                                <tr>
                                    <th class="text-center primary white--text">Hora</th>
                                    <th class="text-center primary white--text">Segunda</th>
                                    <th class="text-center primary white--text">Terça</th>
                                    <th class="text-center primary white--text">Quarta</th>
                                    <th class="text-center primary white--text">Quinta</th>
                                    <th class="text-center primary white--text">Sexta</th>
                                    <th class="text-center primary white--text">Sabado</th>
                                </tr>
                                </thead>
                            </template>

                            <template v-slot:item.hour="{ item }">
                                <v-avatar tile color="primary">
                                    <span style="color: white">{{item.hour}}</span>
                                </v-avatar>
                            </template>

                            <template v-slot:item.monday="{ item }">
                                <strong v-for="(index,i) in item.monday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules && index.cancelations_schedules[0].final_date >= today && index.cancelations_schedules[0].start_date <= today" color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                                <br/>
                                                <br/>
                                                <v-btn @click="openDialoaUpdateDay(index,1)" x-small fab>
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,1)">
                                                    <v-icon>delete_outline</v-icon>
                                                </v-btn>
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                            <div v-if="index.cancelations_schedules.length == 2"><strong>Período de cancelamento: {{index.cancelations_schedules[1].start_date | dateFilter}} a {{index.cancelations_schedules[1].final_date | dateFilter}}</strong></div>
                                            <div v-if="index.cancelations_schedules.length == 3"><strong>Período de cancelamento: {{index.cancelations_schedules[2].start_date | dateFilter}} a {{index.cancelations_schedules[2].final_date | dateFilter}}</strong></div>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                         <br/>
                                         <br/>
                                         <v-btn @click="openDialoaUpdateDay(index,1)" x-small fab>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,1)">
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-card>
                                </strong>
                                <br/>
                            </template>

                            <template v-slot:item.tuesday="{ item }">
                                <strong v-for="(index,i) in item.tuesday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules && index.cancelations_schedules[0].final_date >= today && index.cancelations_schedules[0].start_date <= today" color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                                <br/>
                                                <br/>
                                                <v-btn @click="openDialoaUpdateDay(index,2)" x-small fab>
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,2)">
                                                    <v-icon>delete_outline</v-icon>
                                                </v-btn>
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                            <div v-if="index.cancelations_schedules.length == 2"><strong>Período de cancelamento: {{index.cancelations_schedules[1].start_date | dateFilter}} a {{index.cancelations_schedules[1].final_date | dateFilter}}</strong></div>
                                            <div v-if="index.cancelations_schedules.length == 3"><strong>Período de cancelamento: {{index.cancelations_schedules[2].start_date | dateFilter}} a {{index.cancelations_schedules[2].final_date | dateFilter}}</strong></div>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                        <br/>
                                         <br/>
                                         <v-btn @click="openDialoaUpdateDay(index,2)" x-small fab>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,2)">
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-card>
                                </strong>
                                <br/>
                            </template>

                            <template v-slot:item.wednesday="{ item }">
                                <strong v-for="(index,i) in item.wednesday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules && index.cancelations_schedules[0].final_date >= today && index.cancelations_schedules[0].start_date <= today" color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                                <br/>
                                                <br/>
                                                <v-btn @click="openDialoaUpdateDay(index,3)" x-small fab>
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,3)">
                                                    <v-icon>delete_outline</v-icon>
                                                </v-btn>
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                            <div v-if="index.cancelations_schedules.length == 2"><strong>Período de cancelamento: {{index.cancelations_schedules[1].start_date | dateFilter}} a {{index.cancelations_schedules[1].final_date | dateFilter}}</strong></div>
                                            <div v-if="index.cancelations_schedules.length == 3"><strong>Período de cancelamento: {{index.cancelations_schedules[2].start_date | dateFilter}} a {{index.cancelations_schedules[2].final_date | dateFilter}}</strong></div>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                        <br/>
                                         <br/>
                                         <v-btn @click="openDialoaUpdateDay(index,3)" x-small fab>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,3)">
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-card>
                                </strong>
                                <br/>
                            </template>

                            <template v-slot:item.thursday="{ item }">
                                <strong v-for="(index,i) in item.thursday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules && index.cancelations_schedules[0].final_date >= today && index.cancelations_schedules[0].start_date <= today" color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                                <br/>
                                                <br/>
                                                <v-btn @click="openDialoaUpdateDay(index,4)" x-small fab>
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,4)">
                                                    <v-icon>delete_outline</v-icon>
                                                </v-btn>
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                            <div v-if="index.cancelations_schedules.length == 2"><strong>Período de cancelamento: {{index.cancelations_schedules[1].start_date | dateFilter}} a {{index.cancelations_schedules[1].final_date | dateFilter}}</strong></div>
                                            <div v-if="index.cancelations_schedules.length == 3"><strong>Período de cancelamento: {{index.cancelations_schedules[2].start_date | dateFilter}} a {{index.cancelations_schedules[2].final_date | dateFilter}}</strong></div>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                        <br/>
                                        <br/>
                                         <v-btn @click="openDialoaUpdateDay(index,4)" x-small fab>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,4)">
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-card>
                                </strong>
                                <br/>
                            </template>

                            <template v-slot:item.friday="{ item }">
                                <strong v-for="(index,i) in item.friday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules && index.cancelations_schedules[0].final_date >= today && index.cancelations_schedules[0].start_date <= today" color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                                <br/>
                                                <br/>
                                                <v-btn @click="openDialoaUpdateDay(index,5)" x-small fab>
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,5)">
                                                    <v-icon>delete_outline</v-icon>
                                                </v-btn>
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                            <div v-if="index.cancelations_schedules.length == 2"><strong>Período de cancelamento: {{index.cancelations_schedules[1].start_date | dateFilter}} a {{index.cancelations_schedules[1].final_date | dateFilter}}</strong></div>
                                            <div v-if="index.cancelations_schedules.length == 3"><strong>Período de cancelamento: {{index.cancelations_schedules[2].start_date | dateFilter}} a {{index.cancelations_schedules[2].final_date | dateFilter}}</strong></div>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                        <br/>
                                         <br/>
                                         <v-btn @click="openDialoaUpdateDay(index,5)" x-small fab>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,5)">
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-card>
                                </strong>
                                <br/>
                            </template>

                            <template v-slot:item.saturday="{ item }">
                                <strong v-for="(index,i) in item.saturday" :key="i">
                                    <br/>
                                    <v-tooltip bottom v-if="index.cancelations_schedules && index.cancelations_schedules[0].final_date >= today && index.cancelations_schedules[0].start_date <= today" color="primary">
                                        <template v-slot:activator="{ on }">
                                            <v-card
                                                    v-on="on"
                                                    class="white--text pa-1 my-n2"
                                                    color="grey"
                                            >
                                                {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                                <br/>
                                                <br/>
                                                <v-btn @click="openDialoaUpdateDay(index,6)" x-small fab>
                                                    <v-icon>edit</v-icon>
                                                </v-btn>
                                                <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,6)">
                                                    <v-icon>delete_outline</v-icon>
                                                </v-btn>
                                            </v-card>
                                        </template>
                                        <span>
                                            <strong>Período de cancelamento: {{index.cancelations_schedules[0].start_date | dateFilter}} a {{index.cancelations_schedules[0].final_date | dateFilter}}</strong>
                                            <div v-if="index.cancelations_schedules.length == 2"><strong>Período de cancelamento: {{index.cancelations_schedules[1].start_date | dateFilter}} a {{index.cancelations_schedules[1].final_date | dateFilter}}</strong></div>
                                            <div v-if="index.cancelations_schedules.length == 3"><strong>Período de cancelamento: {{index.cancelations_schedules[2].start_date | dateFilter}} a {{index.cancelations_schedules[2].final_date | dateFilter}}</strong></div>
                                        </span>
                                    </v-tooltip>
                                    <v-card
                                            v-else
                                            class="white--text pa-1 my-n2"
                                            :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
                                    >
                                        {{index.doctor.name}} - {{index.specialty.name}} - {{index.clinic.name}}
                                        <br/>
                                         <br/>
                                         <v-btn @click="openDialoaUpdateDay(index,6)" x-small fab>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn class="ml-2" x-small fab @click="openDialogDelete(index,6)">
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-card>
                                </strong>
                                <br/>
                            </template>

                        </v-data-table>
                        <v-dialog v-model="dialogRemove" max-width="400px">
                            <v-card class="text-left">
                                <v-card-title>
                                <span class="headline">Remover dia da agenda</span>
                                </v-card-title>
                                <v-card-text>
                                <p>Você deseja remover o dia da agenda médica?</p>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogRemove = false">Não</v-btn>
                                <v-btn :loading="loading" color="blue darken-1" text @click="removeDay">Sim</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogUpdate" max-width="400px">
                            <v-card class="text-left">
                                <v-card-title>
                                <span class="headline">Alterar dia da agenda</span>
                                </v-card-title>
                                <v-card-text>
                                <v-container>
                                    <v-row>
                                    <v-col cols="12">
                                        <v-text-field type="time" min="05:00" max="18:00" v-model="editDay.hour" label="Horário" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="editDay.vacancy"
                                            type="number"
                                            label="Vagas"
                                            hint="Digite o número de vagas para o dia"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <h1 class="title font-weight-bold">Data de validade</h1>
                                        <v-text-field
                                            v-model="editDay.expiration_date"
                                            type="date"
                                            hint="Selecione a data de validade da agenda"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    </v-row>
                                </v-container>
                                </v-card-text>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialogUpdate = false">Não</v-btn>
                                <v-btn :loading="loading" color="blue darken-1" text @click="updateDay">Sim</v-btn>
                                </v-card-actions>
                            </v-card>
                            </v-dialog>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    let moment = require('moment/moment');
    export default {
        data: () => ({
            moment: moment,
            //today: '2020-05-16',
            //today: '2020-05-30',
            today: moment().format("YYYY-MM-DD"),
            dialogUpdate:false,
            editDay:{},
            search: undefined,
            headers: [
                {text: 'Hora', value: 'hour', align: 'center', sortable: true},
                {text: 'Segunda', value: 'monday', align: 'center', sortable: false},
                {text: 'Terça', value: 'tuesday', align: 'center', sortable: false},
                {text: 'Quarta', value: 'wednesday', align: 'center', sortable: false},
                {text: 'Quinta', value: 'thursday', align: 'center', sortable: false},
                {text: 'Sexta', value: 'friday', align: 'center', sortable: false},
                {text: 'Sabado', value: 'saturday', align: 'center', sortable: false},
            ],
            dialogRemove:false,
            loading:false,
            scheduleSelected:undefined,
            dayScheduleSelected:undefined,
            specialty:undefined,
            doctor:undefined
        }),
        computed: {
            specialties() {
                let espArray = Object.values(this.$store.getters.specialties);
                /* espArray = espArray.filter(specialty => {
                    if (!this.doctor) {
                    return true;
                    }
                    var find = false;
                    specialty.doctors.forEach(doctor => {
                    if (doctor.cpf === this.doctor.cpf) {
                        find = true;
                        return true;
                    }
                    });

                    return find;
                }); */
                return espArray;
            },

            doctors() {
                let doctors = Object.values(this.$store.getters.doctors);
                /* if (this.specialty) {
                    doctors = doctors.filter(a => {
                    for (let spe in a.specialties) {
                        if (a.specialties[spe].name === this.specialty.name) {
                        return true;
                        }
                    }
                    return false;
                    });
                } */
                return doctors;
            },
            doctorsMapping() {
                let weeklyTable = [
                    {
                        hour: '06:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '06:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '07:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '07:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '08:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '08:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '09:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '09:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '10:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '10:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '11:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '11:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '12:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '12:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '13:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '13:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    }, {
                        hour: '14:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '14:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    }, {
                        hour: '15:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '15:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '16:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '16:30',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                    {
                        hour: '17:00',
                        monday: [],
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                    },
                ]

                console.log('->>')
                let schedules = this.$store.getters.AllSchedules.filter((schedule)=>{
                    if(this.specialty && schedule.specialty.name != this.specialty.name)
                        return false
                    if(this.doctor && schedule.doctor.name != this.doctor.name)
                        return false
                    return true
                })

                for (let schedule in schedules) {
                    if(schedules[schedule].cancelations_schedules){
                        for(let canceled in schedules[schedule].cancelations_schedules) {
                            if(this.today > schedules[schedule].cancelations_schedules[canceled].final_date){
                                let deleted = schedules[schedule].cancelations_schedules.shift()
                                this.$store.dispatch('copyCanceledSchedules', {
                                    schedule: schedules[schedule],
                                    cancelations_schedules: deleted,
                                });
                                if( schedules[schedule].cancelations_schedules.length === 0){
                                    delete schedules[schedule].cancelations_schedules
                                }
                                this.$store.dispatch('updateCanceledSchedules', {
                                    cancelations_schedules: schedules[schedule].cancelations_schedules,
                                    id: schedules[schedule].id,
                                    schedule: schedules[schedule],
                                });
                            }
                        }
                    }
                }

                for (let schedule in schedules) {
                    let daysOfTheWeek = schedules[schedule].days
                    for (let dayOfTheWeek in daysOfTheWeek) {
                        for (let weeklyItem in weeklyTable) {
                            if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '1') {
                                weeklyTable[weeklyItem].monday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '2') {
                                weeklyTable[weeklyItem].tuesday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '3') {
                                weeklyTable[weeklyItem].wednesday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '4') {
                                weeklyTable[weeklyItem].thursday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '5') {
                                weeklyTable[weeklyItem].friday.push(schedules[schedule])
                            } else if (daysOfTheWeek[dayOfTheWeek].hour === weeklyTable[weeklyItem].hour && dayOfTheWeek === '6') {
                                weeklyTable[weeklyItem].saturday.push(schedules[schedule])
                            }
                        }
                    }
                }
                return weeklyTable
            },
        },
        mounted() {
            this.$store.dispatch('getAllSchedules');
        },
        methods:{
            openDialoaUpdateDay(schedule,day){
                this.scheduleSelected = schedule
                this.dayScheduleSelected = day
                this.editDay = schedule.days[day]
                this.dialogUpdate = true
            },
            openDialogDelete(schedule,day){
                this.dialogRemove = true
                this.scheduleSelected = schedule
                this.dayScheduleSelected = day
            },
            async removeDay() {
                this.loading = true;
                let copySchedule = Object.assign({}, this.scheduleSelected);
                delete copySchedule.days[this.dayScheduleSelected];
                await this.$store.dispatch("updateScheduleDays", {
                    idSchedule: this.scheduleSelected.id,
                    days: copySchedule.days
                });
                this.loading = false;
                this.dialogRemove = false;
            },
            async updateDay(){
                this.loading = true;
                let copySchedule = Object.assign({}, this.scheduleSelected);
                copySchedule.days[this.dayScheduleSelected] = this.editDay;
                await this.$store.dispatch("updateScheduleDays", {
                    idSchedule: this.scheduleSelected.id,
                    days: copySchedule.days
                });
                this.editDay = {}
                this.loading = false
                this.dialogUpdate = false;
            }
        }
    }
</script>
