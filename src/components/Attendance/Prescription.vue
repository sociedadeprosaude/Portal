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
<!--                            <v-flex xs11>
                                <v-combobox
                                        prepend-inner-icon="search"
                                        prepend-icon="note_add"
                                        v-model="item"
                                        :items="lista"
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
                            </v-flex>-->

                            <v-flex xs11>
                                <v-combobox
                                        prepend-inner-icon="search"
                                        prepend-icon="note_add"
                                        v-model="item"
                                        :items="lista"
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
                                        <v-flex xs12 class="white"><strong style="color: white">.</strong></v-flex>
                                        <v-alert
                                                dense
                                                outlined
                                                type="error"
                                        >
                                            O medicamento: <strong>{{ search }}</strong> não foi encontrado na lista, escreva-o manualmente na prescrição.
                                        </v-alert>
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
                            <v-flex xs12>
                                <v-btn v-on:click="addToBanc" color="success">
                                    ADD lista de medicamentos no banco de dados
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </v-flex>

                            <v-flex xs12><p style="color: white">.</p></v-flex>
                            <v-flex xs12><p style="color: white">.</p></v-flex>

                            <transition name="fade">
                            <v-flex xs12 v-if="medicines.length > 0">
                                <strong>MEDICAMENTOS SELECIONADOS:</strong>
                            </v-flex>
                            </transition>

                            <transition name="fade">
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
                            </transition>

                            <transition name="fade">
                            <v-flex xs1 v-if="medicines.length > 0">
                                <v-btn v-on:click="deleteFromList" :disabled="!deleteIsValid" color="error">
                                    <v-icon>delete_forever</v-icon>
                                </v-btn>
                            </v-flex>
                            </transition>

                            <transition name="fade">
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
                            </transition>

                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!formIsValid" @click="documentDialog = true"><v-icon left>print</v-icon>GERAR PDF <v-icon right>fa fa-print</v-icon></v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog v-model="documentDialog">
            <prescription-p-d-f @close-dialog="documentDialog = false" :consultation="consultation" :medicines="medicines"></prescription-p-d-f>
        </v-dialog>

    </v-content>
</template>

<script>
    import PrescriptionPDF from "./printing/prescriptionPDF";
    export default {
        components: {PrescriptionPDF},
        props:['consultation'],
        data: () => ({
            documentDialog: false,
            medicines: [],
            item: undefined,
            search: null,
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
                {name:'aroeira (Schinus terebinthifolia Raddi)',concentration:'1,932 mg de ácido gálico (dose diária)',pharmaceutical:'gel vaginal',},
                {name:'aroeira (Schinus terebinthifolia Raddi)',concentration:'1,932 mg de ácido gálico (dose diária)',pharmaceutical:'óvulo vaginal',},
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
                {name:'cabergolina',concentration:'0,5 mg',pharmaceutical:'comprimido',},
                {name:'captopril',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'carbamazepina',concentration:'200 mg',pharmaceutical:'comprimido',},
                {name:'carbamazepina',concentration:'400 mg',pharmaceutical:'comprimido',},
                {name:'carbamazepina',concentration:'20 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'carbonato de cálcio',concentration:'1.250 mg (500 mg de cálcio)',pharmaceutical:'comprimido',},
                {name:'carbonato de cálcio + colecalciferol',concentration:'1.250 mg (500 mg de cálcio) + 200 UI',pharmaceutical:'comprimido',},
                {name:'carbonato de cálcio + colecalciferol',concentration:'1.250 mg (500 mg de cálcio) + 400 UI',pharmaceutical:'comprimido',},
                {name:'carbonato de cálcio + colecalciferol',concentration:'1.500 mg (600 mg de cálcio) + 400 UI',pharmaceutical:'comprimido',},
                {name:'carbonato de lítio',concentration:'300 mg',pharmaceutical:'comprimido',},
                {name:'carvão vegetal ativado',concentration:'–',pharmaceutical:'pó para suspensão oral',},
                {name:'carvedilol',concentration:'carvão vegetal ativado',pharmaceutical:'comprimido',},
                {name:'carvão vegetal ativado',concentration:'6,25 mg',pharmaceutical:'comprimido',},
                {name:'carvão vegetal ativado',concentration:'12,5 mg',pharmaceutical:'comprimido',},
                {name:'carvão vegetal ativado',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'cáscara-sagrada (Rhamnus purshiana DC.)',concentration:'20 mg a 30 mg de derivados hidroxiantracênicos expressos em cascarosídeo A (dose diária)',pharmaceutical:'cápsula',},
                {name:'cáscara-sagrada (Rhamnus purshiana DC.)',concentration:'20 mg a 30 mg de derivados hidroxiantracênicos expressos em cascarosídeo A (dose diária)',pharmaceutical:'tintura',},
                {name:'cefalexina',concentration:'500 mg',pharmaceutical:'cápsula',},
                {name:'cefalexina',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'cefalexina',concentration:'50 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'cefotaxima sódica',concentration:'500 mg',pharmaceutical:'pó para solução injetável',},
                {name:'ceftriaxona',concentration:'250 mg',pharmaceutical:'pó para solução injetável',},
                {name:'ceftriaxona',concentration:'500 mg',pharmaceutical:'pó para solução injetável',},
                {name:'ceftriaxona',concentration:'1 g',pharmaceutical:'pó para solução injetável',},
                {name:'cetoconazol',concentration:'20 mg/g (2%)',pharmaceutical:'xampu',},
                {name:'cianocobalamina',concentration:'1.000 mcg',pharmaceutical:'solução injetável',},
                {name:'ciprofloxacino',concentration:'250 mg',pharmaceutical:'comprimido',},
                {name:'ciprofloxacino',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'claritromicina',concentration:'250 mg',pharmaceutical:'comprimido',},
                {name:'claritromicina',concentration:'500 mg ',pharmaceutical:'comprimido',},
                {name:'claritromicina',concentration:'500 mg',pharmaceutical:'cápsula',},
                {name:'claritromicina',concentration:'50 mg/mL ',pharmaceutical:'suspensão oral',},
                {name:'clonazepam',concentration:'2,5 mg/mL',pharmaceutical:'solução oral',},
                {name:'cloranfenicol',concentration:'250 mg',pharmaceutical:'cápsula',},
                {name:'cloranfenicol',concentration:'250 mg',pharmaceutical:'comprimido',},
                {name:'cloreto de potássio',concentration:'2,56 mEq/mL (19,1%)',pharmaceutical:'solução injetável',},
                {name:'cloreto de sódio',concentration:'3,4 mEq/mL (20%)',pharmaceutical:'solução injetável',},
                {name:'cloreto de sódio',concentration:'0,9% (9 mg/mL)',pharmaceutical:'solução nasal',},
                {name:'cloreto de sódio',concentration:'0,9% (0,154 mEq/mL)',pharmaceutical:'solução injetável',},
                {name:'cloridrato de amiodarona',concentration:'50 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de amiodarona',concentration:'200 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de amitriptilina',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de amitriptilina',concentration:'75 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de biperideno',concentration:'2 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de biperideno',concentration:'4 mg',pharmaceutical:'comprimido de liberação prolongada',},
                {name:'cloridrato de bupivacaína',concentration:'2,5 mg/mL (0,25%)',pharmaceutical:'solução injetável',},
                {name:'cloridrato de bupivacaína',concentration:'5 mg/mL (0,50%)',pharmaceutical:'solução injetável',},
                {name:'cloridrato de clindamicina',concentration:'150 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de clindamicina',concentration:'300 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de clomipramina',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de clomipramina',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de clorpromazina',concentration:'5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de clorpromazina',concentration:'40 mg/mL',pharmaceutical:'solução oral',},
                {name:'cloridrato de clorpromazina',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de clorpromazina',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de dobutamina',concentration:'12,5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de dopamina',concentration:'5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de fluoxetina',concentration:'20 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de fluoxetina',concentration:'20 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de hidralazina',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de hidralazina',concentration:'50 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de lidocaína',concentration:'10 mg/mL (1%)',pharmaceutical:'solução injetável',},
                {name:'cloridrato de lidocaína',concentration:'20 mg/mL (2%)',pharmaceutical:'solução injetável',},
                {name:'cloridrato de lidocaína',concentration:'20 mg/g (2%)',pharmaceutical:'gel',},
                {name:'cloridrato de lidocaína',concentration:'100 mg/mL',pharmaceutical:'solução spray',},
                {name:'cloridrato de lidocaína + glicose',concentration:'50 mg/mL + 75 mg/mL (5% + 7,5%)',pharmaceutical:'solução injetável',},
                {name:'cloridrato de lidocaína + hemitartarato de epinefrina',concentration:'2% + 1:200.000',pharmaceutical:'solução injetável',},
                {name:'cloridrato de lidocaína + hemitartarato de epinefrina',concentration:'2% + 1:80.000',pharmaceutical:'solução injetável',},
                {name:'cloridrato de lidocaína + hemitartarato de epinefrina',concentration:'1% + 1:200.000',pharmaceutical:'solução injetável',},
                {name:'cloridrato de metformina',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de metformina',concentration:'850 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de metoclopramida',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de metoclopramida',concentration:'5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de metoclopramida',concentration:'4 mg/mL',pharmaceutical:'solução oral',},
                {name:'cloridrato de naloxona',concentration:'0,4 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de nortriptilina',concentration:'10 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de nortriptilina',concentration:'25 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de nortriptilina',concentration:'50 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de nortriptilina',concentration:'75 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de ondansetrona',concentration:'4 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de ondansetrona',concentration:'4 mg',pharmaceutical:'comprimido orodispersível',},
                {name:'cloridrato de ondansetrona',concentration:'8 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de ondansetrona',concentration:'8 mg',pharmaceutical:'comprimido orodispersível',},
                {name:'cloridrato de pilocarpina',concentration:'20 mg/mL (2%)',pharmaceutical:'solução oftálmica',},
                {name:'cloridrato de piridoxina',concentration:'40 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de prilocaína + felipressina',concentration:'30 mg/mL (3%) + 0,03 UI mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de prometazina',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de prometazina',concentration:'25 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de propafenona',concentration:'150 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de propafenona',concentration:'300 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de propranolol',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de propranolol',concentration:'40 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de protamina',concentration:'10 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de ranitidina',concentration:'25 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de ranitidina',concentration:'15 mg/mL',pharmaceutical:'xarope',},
                {name:'cloridrato de ranitidina',concentration:'150 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de tetraciclina',concentration:'10 mg/g (1%)',pharmaceutical:'pomada oftálmica',},
                {name:'cloridrato de tetraciclina',concentration:'500 mg',pharmaceutical:'cápsula',},
                {name:'cloridrato de tiamina',concentration:'300 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de verapamil',concentration:'80 mg',pharmaceutical:'comprimido',},
                {name:'cloridrato de verapamil',concentration:'2,5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'cloridrato de verapamil',concentration:'120 mg',pharmaceutical:'comprimido',},
                {name:'decanoato de haloperidol',concentration:'1 mg/g (0,1%)',pharmaceutical:'creme',},
                {name:'dexametasona',concentration:'1 mg/g (0,1%)',pharmaceutical:'pomada oftálmica',},
                {name:'dexametasona',concentration:'1 mg/mL (0,1%)',pharmaceutical:'suspensão oftálmica',},
                {name:'dexametasona',concentration:'4 mg',pharmaceutical:'comprimido',},
                {name:'dexametasona',concentration:'0,1 mg/mL',pharmaceutical:'elixir',},
                {name:'diazepam',concentration:'5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'diazepam',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'diazepam',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'digliconato de clorexidina',concentration:'0,12%',pharmaceutical:'solução bucal',},
                {name:'digliconato de clorexidina',concentration:'2% a 4%',pharmaceutical:'solução para uso tópico',},
                {name:'digoxina',concentration:'0,25 mg',pharmaceutical:'comprimido',},
                {name:'digoxina',concentration:'0,05 mg/mL',pharmaceutical:'elixir',},
                {name:'dinitrato de isossorbida',concentration:'5 mg',pharmaceutical:'comprimido sublingual',},
                {name:'dipirona',concentration:'500 mg/mL',pharmaceutical:'solução injetável',},
                {name:'dipirona',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'dipirona',concentration:'500 mg/mL',pharmaceutical:'solução oral',},
                {name:'dipropionato de beclometasona',concentration:'50 mcg/dose',pharmaceutical:'solução para inalação oral',},
                {name:'dipropionato de beclometasona',concentration:'50 mcg/dose',pharmaceutical:'suspensão para inalação nasal',},
                {name:'dipropionato de beclometasona',concentration:'200 mcg/dose',pharmaceutical:'pó para inalação oral',},
                {name:'dipropionato de beclometasona',concentration:'200 mcg/dose',pharmaceutical:'solução para inalação oral',},
                {name:'dipropionato de beclometasona',concentration:'200 mcg/dose',pharmaceutical:'cápsula para inalação oral',},
                {name:'dipropionato de beclometasona',concentration:'250 mcg/dose',pharmaceutical:'solução para inalação oral',},
                {name:'dipropionato de beclometasona',concentration:'400 mcg/dose',pharmaceutical:'pó para inalação oral',},
                {name:'dipropionato de beclometasona',concentration:'400 mcg/dose',pharmaceutical:'cápsula para inalação oral',},
                {name:'enantato de noretisterona + valerato de estradiol',concentration:'50 mg/mL + 5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'epinefrina',concentration:'1 mg/mL',pharmaceutical:'solução injetável',},
                {name:'espinheira-santa (Maytenus ilicifolia Mart. ex Reissek)',concentration:'60 mg a 90 mg de taninos totais expressos em pirogalol (dose diária)',pharmaceutical:'cápsula',},
                {name:'espinheira-santa (Maytenus ilicifolia Mart. ex Reissek)',concentration:'60 mg a 90 mg de taninos totais expressos em pirogalol (dose diária)',pharmaceutical:'tintura',},
                {name:'espinheira-santa (Maytenus ilicifolia Mart. ex Reissek)',concentration:'60 mg a 90 mg de taninos totais expressos em pirogalol (dose diária)',pharmaceutical:'suspensão oral',},
                {name:'espinheira-santa (Maytenus ilicifolia Mart. ex Reissek)',concentration:'60 mg a 90 mg de taninos totais expressos em pirogalol (dose diária)',pharmaceutical:'emulsão oral',},
                {name:'espironolactona',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'espironolactona',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'estolato de eritromicina',concentration:'25 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'estolato de eritromicina',concentration:'50 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'estolato de eritromicina',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'estriol',concentration:'1 mg/g',pharmaceutical:'creme vaginal',},
                {name:'estrogênios conjugados',concentration:'0,625 mg/g',pharmaceutical:'creme vaginal',},
                {name:'estrogênios conjugados',concentration:'0,3 mg',pharmaceutical:'comprimido',},
                {name:'etinilestradiol + levonorgestrel',concentration:'0,03 mg + 0,15 mg',pharmaceutical:'comprimido',},
                {name:'fenitoína',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'fenitoína',concentration:'20 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'fenitoína',concentration:'50 mg/mL',pharmaceutical:'solução injetável',},
                {name:'fenobarbital',concentration:'100 mg/mL',pharmaceutical:'solução injetável',},
                {name:'fenobarbital',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'fenobarbital',concentration:'40 mg/mL',pharmaceutical:'solução oral',},
                {name:'finasterida',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'fluconazol',concentration:'150 mg',pharmaceutical:'cápsula',},
                {name:'fluconazol',concentration:'10 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'fluconazol',concentration:'100 mg',pharmaceutical:'cápsula',},
                {name:'flumazenil',concentration:'0,1 mg/mL',pharmaceutical:'solução injetável',},
                {name:'folinato de cálcio (ácido folínico)',concentration:'15 mg',pharmaceutical:'comprimido',},
                {name:'fosfato de clindamicina',concentration:'1%',pharmaceutical:'gel',},
                {name:'fosfato de clindamicina',concentration:'1%',pharmaceutical:'solução tópica',},
                {name:'fosfato de cálcio tribásico + colecalciferol',concentration:'1661,616 mg (600 mg de cálcio) + 400 UI',pharmaceutical:'comprimido',},
                {name:'fosfato de potássio monobásico + fosfato de potássio dibásico',concentration:'0,03 g/mL + 0,1567 g/mL',pharmaceutical:'solução injetável',},
                {name:'fosfato dissódico de dexametasona',concentration:'4 mg/mL',pharmaceutical:'solução injetável',},
                {name:'fosfato sódico de prednisolona',concentration:'1 mg/mL',pharmaceutical:'solução oral',},
                {name:'fosfato sódico de prednisolona',concentration:'3 mg/mL',pharmaceutical:'solução oral',},
                {name:'furosemida',concentration:'40 mg',pharmaceutical:'comprimido',},
                {name:'furosemida',concentration:'10 mg/mL',pharmaceutical:'solução injetável',},
                {name:'garra-do-diabo (Harpagophytum procumbens DC. ex Meissn.)',concentration:'30 mg a 100 mg de harpagosídeo ou 45 mg a 150 mg de iridoides totais expressos em harpagosídeos (dose diária)',pharmaceutical:'cápsula',},
                {name:'garra-do-diabo (Harpagophytum procumbens DC. ex Meissn.)',concentration:'30 mg a 100 mg de harpagosídeo ou 45 mg a 150 mg de iridoides totais expressos em harpagosídeos (dose diária)',pharmaceutical:'comprimido',},
                {name:'garra-do-diabo (Harpagophytum procumbens DC. ex Meissn.)',concentration:'30 mg a 100 mg de harpagosídeo ou 45 mg a 150 mg de iridoides totais expressos em harpagosídeos (dose diária)',pharmaceutical:'comprimido de liberação retardada',},
                {name:'glibenclamida',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'glicerol',concentration:'120 mg/mL',pharmaceutical:'solução retal',},
                {name:'glicerol',concentration:'72 mg',pharmaceutical:'supositório retal',},
                {name:'gliclazida',concentration:'30 mg',pharmaceutical:'comprimido de liberação prolongada',},
                {name:'gliclazida',concentration:'60 mg',pharmaceutical:'comprimido de liberação prolongada',},
                {name:'gliclazida',concentration:'80 mg',pharmaceutical:'comprimido',},
                {name:'glicose',concentration:'50 mg/mL (5%)',pharmaceutical:'solução injetável',},
                {name:'glicose',concentration:'100 mg/mL (10%)',pharmaceutical:'solução injetável',},
                {name:'glicose',concentration:'500 mg/mL (50%)',pharmaceutical:'solução injetável',},
                {name:'guaco (Mikania glomerata Spreng.)',concentration:'0,5 mg a 5 mg de cumarina (dose diária)',pharmaceutical:'tintura',},
                {name:'guaco (Mikania glomerata Spreng.)',concentration:'0,5 mg a 5 mg de cumarina (dose diária)',pharmaceutical:'xarope',},
                {name:'guaco (Mikania glomerata Spreng.)',concentration:'0,5 mg a 5 mg de cumarina (dose diária)',pharmaceutical:'solução oral',},
                {name:'haloperidol',concentration:'1 mg',pharmaceutical:'comprimido',},
                {name:'haloperidol',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'haloperidol',concentration:'2 mg/mL',pharmaceutical:'solução oral',},
                {name:'haloperidol',concentration:'5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'hemitartarato de norepinefrina',concentration:'2 mg/mL',pharmaceutical:'solução injetável',},
                {name:'heparina sódica',concentration:'5.000 UI/0,25 mL',pharmaceutical:'solução injetável',},
                {name:'hidroclorotiazida',concentration:'12,5 mg',pharmaceutical:'comprimido',},
                {name:'hidroclorotiazida',concentration:'25 mg',pharmaceutical:'comprimido',},
                {name:'hidróxido de alumínio',concentration:'230 mg',pharmaceutical:'comprimido',},
                {name:'hidróxido de alumínio',concentration:'300 mg',pharmaceutical:'comprimido',},
                {name:'hidróxido de alumínio',concentration:'61,5 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'hipromelose',concentration:'3 mg/mL (0,3%)',pharmaceutical:'solução oftálmica',},
                {name:'hipromelose',concentration:'5 mg/mL (0,5%)',pharmaceutical:'solução oftálmica',},
                {name:'hortelã (Mentha x piperita L.)',concentration:'60 mg a 440 mg de mentol e 28 mg a 256 mg de mentona (dose diária)',pharmaceutical:'cápsula',},
                {name:'ibuprofeno',concentration:'200 mg',pharmaceutical:'comprimido',},
                {name:'ibuprofeno',concentration:'300 mg',pharmaceutical:'comprimido',},
                {name:'ibuprofeno',concentration:'600 mg',pharmaceutical:'comprimido',},
                {name:'ibuprofeno',concentration:'50 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'imiquimode',concentration:'50 mg/g',pharmaceutical:'creme',},
                {name:'insulina humana NPH',concentration:'100 UI/mL',pharmaceutical:'suspensão injetável',},
                {name:'insulina humana regular',concentration:'100 UI/mL',pharmaceutical:'solução injetável',},
                {name:'isoflavona-de-soja [Glycine max (L.) Merr.]',concentration:'50 mg a 120 mg de isoflavonas (dose diária)',pharmaceutical:'cápsula',},
                {name:'isoflavona-de-soja [Glycine max (L.) Merr.]',concentration:'50 mg a 120 mg de isoflavonas (dose diária)',pharmaceutical:'comprimido',},
                {name:'itraconazol',concentration:'100 mg',pharmaceutical:'cápsula',},
                {name:'itraconazol',concentration:'10 mg/mL',pharmaceutical:'solução oral',},
                {name:'ivermectina',concentration:'6 mg',pharmaceutical:'comprimido',},
                {name:'lactato de biperideno',concentration:'5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'lactulose',concentration:'667 mg/mL',pharmaceutical:'xarope',},
                {name:'levodopa + benserazida',concentration:'100 mg + 25 mg',pharmaceutical:'cápsula',},
                {name:'levodopa + benserazida',concentration:'100 mg + 25 mg',pharmaceutical:'comprimido',},
                {name:'levodopa + benserazida',concentration:'200 mg + 50 mg',pharmaceutical:'comprimido',},
                {name:'levodopa + carbidopa',concentration:'200 mg + 50 mg',pharmaceutical:'comprimido',},
                {name:'levodopa + carbidopa',concentration:'250 mg + 25 mg',pharmaceutical:'comprimido',},
                {name:'levonorgestrel',concentration:'0,75 mg',pharmaceutical:'comprimido',},
                {name:'levodopa + carbidopa',concentration:'1,5 mg',pharmaceutical:'comprimido',},
                {name:'levotiroxina sódica',concentration:'25 mcg',pharmaceutical:'comprimido',},
                {name:'levotiroxina sódica',concentration:'50 mcg',pharmaceutical:'comprimido',},
                {name:'levotiroxina sódica',concentration:'100 mcg',pharmaceutical:'comprimido',},
                {name:'loratadina',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'loratadina',concentration:'1 mg/mL',pharmaceutical:'xarope',},
                {name:'losartana potássica',concentration:'50 mg',pharmaceutical:'comprimido',},
                {name:'maleato de dexclorfeniramina',concentration:'2 mg',pharmaceutical:'comprimido',},
                {name:'maleato de dexclorfeniramina',concentration:'0,4 mg/mL',pharmaceutical:'solução oral',},
                {name:'maleato de dexclorfeniramina',concentration:'0,4 mg/mL',pharmaceutical:'xarope',},
                {name:'maleato de enalapril',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'maleato de enalapril',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'maleato de enalapril',concentration:'20 mg',pharmaceutical:'comprimido',},
                {name:'maleato de timolol',concentration:'2,5 mg/mL (0,25%)',pharmaceutical:'solução oftálmica',},
                {name:'maleato de timolol',concentration:'5 mg/mL (0,5%)',pharmaceutical:'solução oftálmica',},
                {name:'mesilato de doxazosina',concentration:'2 mg',pharmaceutical:'comprimido',},
                {name:'mesilato de doxazosina',concentration:'4 mg',pharmaceutical:'comprimido',},
                {name:'mesilato de pralidoxima',concentration:'200 mg',pharmaceutical:'solução injetável',},
                {name:'metildopa',concentration:'250 mg',pharmaceutical:'comprimido',},
                {name:'metronidazol',concentration:'100 mg/g (10%)',pharmaceutical:'gel vaginal',},
                {name:'metronidazol',concentration:'250 mg',pharmaceutical:'comprimido',},
                {name:'metronidazol',concentration:'400 mg',pharmaceutical:'comprimido',},
                {name:'midazolam',concentration:'2 mg/mL',pharmaceutical:'solução oral',},
                {name:'misoprostol',concentration:'25 mcg',pharmaceutical:'comprimido vaginal',},
                {name:'misoprostol',concentration:'200 mcg',pharmaceutical:'comprimido vaginal',},
                {name:'mononitrato de isossorbida',concentration:'20 mg',pharmaceutical:'comprimido',},
                {name:'mononitrato de isossorbida',concentration:'40 mg',pharmaceutical:'comprimido',},
                {name:'nifedipino',concentration:'10 mg',pharmaceutical:'cápsula',},
                {name:'nifedipino',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'nistatina',concentration:'100.000 UI/mL',pharmaceutical:'suspensão oral',},
                {name:'nitrato de miconazol',concentration:'2% (20 mg/g)',pharmaceutical:'gel oral',},
                {name:'nitrato de miconazol',concentration:'2% (20 mg/g)',pharmaceutical:'loção',},
                {name:'nitrato de miconazol',concentration:'2% (20 mg/g)',pharmaceutical:'pó',},
                {name:'nitrato de miconazol',concentration:'2% (20 mg/g)',pharmaceutical:'creme vaginal',},
                {name:'nitrato de miconazol',concentration:'2% (20 mg/g)',pharmaceutical:'creme',},
                {name:'nitrofurantoína',concentration:'100 mg',pharmaceutical:'cápsula',},
                {name:'nitrofurantoína',concentration:'5 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'noretisterona',concentration:'0,35 mg',pharmaceutical:'comprimido',},
                {name:'óleo mineral',concentration:'–',pharmaceutical:'óleo para uso oral',},
                {name:'omeprazol',concentration:'10 mg',pharmaceutical:'cápsula',},
                {name:'omeprazol',concentration:'20 mg',pharmaceutical:'cápsula',},
                {name:'palmitato de retinol',concentration:'150.000 UI/mL',pharmaceutical:'solução oral',},
                {name:'paracetamol',concentration:'200 mg/mL',pharmaceutical:'solução oral',},
                {name:'paracetamol',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'pasta-d’água',concentration:'FN*',pharmaceutical:'pasta',},
                {name:'permanganato de potássio',concentration:'100 mg',pharmaceutical:'comprimido para uso tópico',},
                {name:'permanganato de potássio',concentration:'100 mg (FN)*',pharmaceutical:'pó',},
                {name:'permetrina',concentration:'10 mg/g (1%)',pharmaceutical:'loção',},
                {name:'permetrina',concentration:'50 mg/g (5%)',pharmaceutical:'loção',},
                {name:'peróxido de benzoíla',concentration:'25 mg/g (2,5%) (FN)*',pharmaceutical:'gel',},
                {name:'peróxido de benzoíla',concentration:'50 mg/g (5%) (FN)*',pharmaceutical:'gel',},
                {name:'plantago (Plantago ovata Forssk.)',concentration:'3 g a 30 g (dose diária)',pharmaceutical:'pó para dispersão oral',},
                {name:'podofilina',concentration:'100 mg/mL (10%) a 250 mg/mL (25%) (FN)*',pharmaceutical:'solução para uso tópico',},
                {name:'podofilotoxina',concentration:'1,5 mg/g',pharmaceutical:'creme',},
                {name:'prednisona',concentration:'5 mg',pharmaceutical:'comprimido',},
                {name:'prednisona',concentration:'20 mg',pharmaceutical:'comprimido',},
                {name:'propiltiouracila',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'rifampicina',concentration:'300 mg',pharmaceutical:'cápsula',},
                {name:'sais para reidratação oral',concentration:'cloreto de sódio, glicose anidra, cloreto de potássio, citrato de sódio di-hidratado',pharmaceutical:'pó para solução oral',},
                {name:'salgueiro (Salix alba L.)',concentration:'60 mg a 240 mg de salicina (dose diária)',pharmaceutical:'comprimido',},
                {name:'salgueiro (Salix alba L.)',concentration:'60 mg a 240 mg de salicina (dose diária)',pharmaceutical:'elixir',},
                {name:'salgueiro (Salix alba L.)',concentration:'60 mg a 240 mg de salicina (dose diária)',pharmaceutical:'solução oral',},
                {name:'sinvastatina',concentration:'10 mg',pharmaceutical:'comprimido',},
                {name:'sinvastatina',concentration:'20 mg',pharmaceutical:'comprimido',},
                {name:'sinvastatina',concentration:'40 mg',pharmaceutical:'comprimido',},
                {name:'solução ringer + lactato',concentration:'lactato de sódio 3 mg/mL + cloreto de sódio 6 mg/mL + cloreto de potássio 0,3 mg/mL + cloreto de cálcio 0,2 mg/mL',pharmaceutical:'solução injetável',},
                {name:'succinato de metoprolol',concentration:'25 mg',pharmaceutical:'comprimido de liberação prolongada',},
                {name:'succinato de metoprolol',concentration:'50 mg',pharmaceutical:'comprimido de liberação prolongada',},
                {name:'succinato de metoprolol',concentration:'100 mg',pharmaceutical:'comprimido de liberação prolongada',},
                {name:'succinato sódico de hidrocortisona',concentration:'100 mg',pharmaceutical:'pó para solução injetável',},
                {name:'succinato sódico de hidrocortisona',concentration:'500 mg',pharmaceutical:'pó para solução injetável',},
                {name:'sulfadiazina de prata',concentration:'10 mg/g (1%)',pharmaceutical:'creme',},
                {name:'sulfametoxazol + trimetoprima',concentration:'40 mg/mL + 8 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'sulfametoxazol + trimetoprima',concentration:'80 mg/mL + 16 mg/mL',pharmaceutical:'solução injetável',},
                {name:'sulfametoxazol + trimetoprima',concentration:'400 mg + 80 mg',pharmaceutical:'comprimido',},
                {name:'sulfato de atropina',concentration:'0,25 mg/mL',pharmaceutical:'solução injetável',},
                {name:'sulfato de gentamicina',concentration:'5 mg/g',pharmaceutical:'pomada oftálmica',},
                {name:'sulfato de gentamicina',concentration:'5 mg/mL',pharmaceutical:'solução oftálmica',},
                {name:'sulfato de magnésio',concentration:'–',pharmaceutical:'pó para solução oral',},
                {name:'sulfato de magnésio',concentration:'10% (0,81 mEq/mL Mg++)',pharmaceutical:'solução injetável',},
                {name:'sulfato de magnésio',concentration:'50% (4,05 mEq/mL Mg++)',pharmaceutical:'solução injetável',},
                {name:'sulfato de polimixina B + sulfato de neomicina + fluocinolona acetonida + cloridrato de lidocaína',concentration:'10.000 ui/ml + 3,500 mg/ml + 0,250 mg/ml + 20 mg/ml',pharmaceutical:'solução otológica',},
                {name:'sulfato de salbutamol',concentration:'100 mcg/dose',pharmaceutical:'aerossol oral',},
                {name:'sulfato de salbutamol',concentration:'5 mg/mL',pharmaceutical:'solução para inalação',},
                {name:'sulfato de salbutamol',concentration:'0,5 mg/mL',pharmaceutical:'solução injetável',},
                {name:'sulfato de zinco',concentration:'200 mcg/mL',pharmaceutical:'solução injetável',},
                {name:'sulfato de zinco',concentration:'10 mg',pharmaceutical:'comprimido mastigável',},
                {name:'sulfato de zinco',concentration:'4 mg/mL',pharmaceutical:'xarope',},
                {name:'sulfato ferroso',concentration:'5 mg/mL',pharmaceutical:'xarope',},
                {name:'sulfato ferroso',concentration:'25 mg/mL',pharmaceutical:'solução oral',},
                {name:'sulfato ferroso',concentration:'40 mg',pharmaceutical:'comprimido',},
                {name:'tartarato de metoprolol',concentration:'100 mg',pharmaceutical:'comprimido',},
                {name:'teclozana',concentration:'500 mg',pharmaceutical:'comprimido',},
                {name:'teclozana',concentration:'10 mg/mL',pharmaceutical:'suspensão oral',},
                {name:'unha-de-gato [Uncaria tomentosa (Willd. ex Roem. & Schult.)]',concentration:'0,9 mg de alcaloides oxindólicos pentaclíclicos',pharmaceutical:'cápsula',},
                {name:'unha-de-gato [Uncaria tomentosa (Willd. ex Roem. & Schult.)]',concentration:'0,9 mg de alcaloides oxindólicos pentaclíclicos',pharmaceutical:'comprimido',},
                {name:'unha-de-gato [Uncaria tomentosa (Willd. ex Roem. & Schult.)]',concentration:'0,9 mg de alcaloides oxindólicos pentaclíclicos',pharmaceutical:'gel',},
                {name:'varfarina sódica',concentration:'1 mg',pharmaceutical:'comprimido',},
                {name:'varfarina sódica',concentration:'5 mg',pharmaceutical:'comprimido',},
                ]
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
            lista() {
                let arr = this.$store.getters.medicines[0];
                let medic = [];
                for (let i in arr){
                    medic.push(arr[i])
                }
                return medic;
            }
        },
        mounted() {
            this.$store.dispatch('getMedicines');
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
            addToBanc() {
                this.$store.dispatch('addArrayOfMedicinesToBanc', { medicines: this.sus })
            }
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
    .fade-enter {
        opacity: 0;
    }
    .fade-enter-active {
        transition: opacity 0.5s ease-in;
    }
    .fade-leave-active {
        transition: opacity 0.5s ease-out;
    }
    .fade-leave-to {
        opacity: 0;
    }
</style>