<template>
    <v-content>
        <v-container fluid>
            <v-card class="elevation-3">
                <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                    <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>PRESCRIÇÃO MÉDICA<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container fluid>
                        <v-layout row wrap class="align-center justify-center">
                            <v-flex xs11>
                                <v-combobox
                                        prepend-inner-icon="search"
                                        prepend-icon="note_add"
                                        v-model="item"
                                        :items="sus"
                                        return-object
                                        :item-text="text"
                                        item-key="concentration"
                                        label="Medicamentos"
                                        chips
                                        :search-input.sync="search"
                                        clearable
                                        outlined
                                >
                                    <template v-slot:no-data>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    <v-chip color="warning"><h2>Faça uma prescrição manual, porque o medicamento <v-chip color="red"><h1>"{{ search }}"</h1></v-chip> não foi encontrado na lista de medicamentos do pró-saúde.</h2></v-chip>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>

                                    <template v-slot:selection="data">
                                        <v-chip
                                                :key="JSON.stringify(data.item)"
                                                v-bind="data.attrs"
                                                :input-value="data.selected"
                                                :disabled="data.disabled"
                                                @click:close="data.parent.selectItem(data.item)"
                                                color="info"
                                        >
                                            {{ data.item.name }} - {{ data.item.concentration }} - {{ data.item.pharmaceutical }}
                                        </v-chip>
                                    </template>
                                </v-combobox>
                            </v-flex>
                            <v-flex xs1>
                                <v-btn v-on:click="addToList" :disabled="!addIsValid" color="success">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12><p style="color: white">.</p></v-flex>
                            <v-flex xs12><p style="color: white">.</p></v-flex>
                            <v-flex xs12><p style="color: white">.</p></v-flex>
                            <v-flex xs12><p style="color: white">.</p></v-flex>
                            <v-flex xs12 v-if="medicines.length > 0">
                                <strong>MEDICAMENTOS SELECIONADOS:</strong>
                            </v-flex>
                            <v-flex xs11 v-if="medicines.length > 0">
                                <v-combobox
                                        :items="medicines"
                                        item-text="name"
                                        return-object
                                        multiple
                                        v-model="medicines"
                                        chips
                                        outlined
                                        hide-selected
                                >
                                    <template v-slot:selection="data">
                                        <v-chip
                                                close
                                                @click="data.select"
                                                @click:close="remove(data.item)"
                                                :key="JSON.stringify(data.item)"
                                                :input-value="data.selected"
                                                :disabled="data.disabled"
                                                class="v-chip--select-multi"
                                                @click.stop="data.parent.selectedIndex = data.index"
                                                @input="data.parent.selectItem(data.item)"
                                                text-color="white"
                                                color="info"
                                        >{{ data.item.name }} - {{ data.item.concentration}} - {{ data.item.pharmaceutical }}
                                        </v-chip>
                                    </template>
                                </v-combobox>
                            </v-flex>
                            <v-flex xs1 v-if="medicines.length > 0">
                                <v-btn v-on:click="deleteFromList" :disabled="!deleteIsValid" color="error">
                                    <v-icon>delete_forever</v-icon>
                                </v-btn>
                            </v-flex>

                            <v-flex xs12 v-if="medicines.length > 0">
                                <h1>Exames Solicitados:</h1>
                                <br>
                                <transition-group name="slide-up">
                                <ul v-for="(dados,i) in medicines" :key="i">
                                    <li>
                                        {{dados.name}} - {{dados.concentration}} - {{dados.pharmaceutical}}
                                    </li>
                                </ul>
                                </transition-group>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
<!--                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="null">Salvar</v-btn>
                </v-card-actions>-->
            </v-card>
        </v-container>
    </v-content>
</template>

<script>
    export default {
        props:['consultation'],
        data: () => ({
            sus: [
                {name:'acetato de betametasona + fosfato dissódico de betametasona',concentration:'3 mg/mL + 3 mg/mL',pharmaceutical:'suspensão injetável',},
                {name:'acetato de hidrocortisona',concentration:'10 mg/g (1%)',pharmaceutical:'creme',},
                {name:'acetato de medroxiprogesterona',concentration:'50 mg/mL',pharmaceutical:'suspensão injetável',},
                {name:'acetato de medroxiprogesterona',concentration:'150 mg/mL',pharmaceutical:'suspensão injetável',},
                {name:'acetato de medroxiprogesterona',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'acetato de sódio',concentration:'2 mEq/mL',pharmaceutical:'solução injetável',},
                {name:'acetazolamida',concentration:'200 mg',pharmaceutical:'creme',},
                {name:'aciclovir',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'ácido fólico',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'ácido fólico',concentration:'0,2 mg/mL',pharmaceutical:'solução oral',},
                {name:'ácido salicílico',concentration:'50 mg/g (5%)',pharmaceutical:'pomada',},
                {name:'ácido valproico (valproato de sódio)',concentration:'250 mg',pharmaceutical:'cápsula',},
                {name:'ácido valproico (valproato de sódio)',concentration:'250 mg',pharmaceutical:'comprimido',},
                {name:'ácido valproico (valproato de sódio)',concentration:'50 mg/mL',pharmaceutical:'solução oral',},
                {name:'ácido valproico (valproato de sódio)',concentration:'50 mg/mL',pharmaceutical:'xarope',},
                {name:'ácido valproico (valproato de sódio)',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'albendazol',concentration:'40 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'albendazol',concentration:'400 mg',pharmaceutical:'comprimido mastigável',},
                {name:'alcachofra(Cynara scolymus L.)',concentration:'24 mg a 48 mg de derivados de ácido cafeoilquínico expressos em ácido clorogênico (dose diária)',pharmaceutical:'cápsula',},
                {name:'alcachofra(Cynara scolymus L.)',concentration:'24 mg a 48 mg de derivados de ácido cafeoilquínico expressos em ácido clorogênico (dose diária)',pharmaceutical:'comprimido',},
                {name:'alcachofra(Cynara scolymus L.)',concentration:'24 mg a 48 mg de derivados de ácido cafeoilquínico expressos em ácido clorogênico (dose diária)',pharmaceutical:'solução oral',},
                {name:'alcachofra(Cynara scolymus L.)',concentration:'24 mg a 48 mg de derivados de ácido cafeoilquínico expressos em ácido clorogênico (dose diária)',pharmaceutical:'tintura',},
                {name:'alcatrão mineral',concentration:'10 mg/g (1%)',pharmaceutical:'pomada',},
                {name:'alendronato de sódio',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'alendronato de sódio',concentration:'70 mg',pharmaceutical:'comprimido',},
                {name:'alopurinol',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'alopurinol',concentration:'300 mg',pharmaceutical:'comprimido',},
                {name:'amoxicilina',concentration:'50 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'amoxicilina',concentration:'500 mg',pharmaceutical:'cápsula',},
                {name:'amoxicilina',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'amoxicilina + clavulanato de potássio',concentration:'50 mg/mL + 12,5 mg/mL',pharmaceutical:'comprimido',},
                {name:'anlodipino',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'anlodipino',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'aroeira (Schinus terebinthifolia Raddi)',concentration:'1,932 mg de ácido gálico',pharmaceutical:'(dose diária)',},
                {name:'gel vaginal',concentration:'1,932 mg de ácido gálico (dose diária)',pharmaceutical:'óvulo vaginal',},
                {name:'atenolol',concentration:'50 mg',pharmaceutical:'comprimido',},
                {name:'atenolol',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'azitromicina',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'azitromicina',concentration:'40 mg/mL',pharmaceutical:'pó para suspensão oral',},
                {name:'babosa [Aloe vera (L.) Burm. f.]',concentration:'10-70% gel fresco',pharmaceutical:'creme',},
                {name:'babosa [Aloe vera (L.) Burm. f.]',concentration:'10-70% gel fresco',pharmaceutical:'gel',},
                {name:'benzilpenicilina benzatina',concentration:'600.000 UI',pharmaceutical:'pó para suspensão injetável',},
                {name:'benzilpenicilina benzatina',concentration:'600.000 UI',pharmaceutical:'suspensão injetável',},
                {name:'benzilpenicilina benzatina',concentration:'1.200.000 UI',pharmaceutical:'pó para suspensão injetável',},
                {name:'benzilpenicilina benzatina',concentration:'1.200.000 UI',pharmaceutical:'suspensão injetável',},
                {name:'benzilpenicilina potássica',concentration:'5.000.000 UI',pharmaceutical:'pó para solução injetável',},
                {name:'benzilpenicilina procaína + benzilpenicilina potássica',concentration:'300.000 UI + 100.000 UI',pharmaceutical:'pó para suspensão injetável',},
                {name:'benzoilmetronidazol',concentration:'40 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'bicarbonato de sódio',concentration:'1 mEq/mL (8,4%)',pharmaceutical:'solução injetável',},
                {name:'brometo de ipratrópio',concentration:'0,25 mg/mL',pharmaceutical:'solução para inalação',},
                {name:'brometo de ipratrópio',concentration:'20 mcg/dose',pharmaceutical:'solução para inalação oral',},
                {name:'budesonida',concentration:'32 mcg',pharmaceutical:'suspensão para inalação nasal',},
                {name:'budesonida',concentration:'50 mcg',pharmaceutical:'suspensão para inalação nasal',},
                {name:'budesonida',concentration:'64 mcg',pharmaceutical:'suspensão para inalação nasal',},
            ],
            medicines: [],
            item: undefined,
            search: null,
        }),
        computed:{
            formIsValid() {
                return this.medicines.length > 0
            },
            addIsValid() {
                return this.item
            },
            deleteIsValid() {
                return this.medicines.length > 0
            },
        },
        mounted() {
            window.addEventListener('keydown', this.handleEnter);
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleEnter)
        },
        methods: {
            text: item => item.name + ' - ' + item.concentration + ' - ' + item.pharmaceutical,
            remove (item) {
                const index = this.medicines.indexOf(item)
                if (index >= 0) this.medicines.splice(index, 1)
            },
            clear() {
                this.item = undefined
                this.medicines = [];
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.addToList()
                }
            },
            addToList() {
                if (this.medicines.indexOf(this.item) > -1) {
                    return
                }
                this.medicines.push(this.item);
                this.item = undefined;
            },
            deleteFromList() {
                this.medicines = [];
            },
        },
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
    }
    .slide-up-enter {
        transform: translateX(-10px);
        opacity: 0;
    }
    .slide-up-enter-active {
        transition: all 0.5s ease;
    }
    .slide-up-move {
        transition: transform 0.5s ease-in;
    }
</style>