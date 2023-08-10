<script setup>

import Card from "@components/common/Card.vue";
import Switch from "@components/common/Switch.vue";
import Modal from "@components/common/Modal.vue";
import Button from "@components/common/Button.vue";
import { computed, onMounted, ref } from "vue";
import { getParametresById } from "@api/parametres.js";
import { getProfils } from "@api/profil.js";
import { useRoute } from "vue-router";
import { patchParametreActivite } from "@api/parametreActivite.js";
import { toast } from "vue3-toastify";
import { patchParametreFitArena } from "@api/parametreFitArena.js";

const PARAM_NB_JOURS_VISIBLES = 'nombre_de_jours_visibles_pour_la_reservation_de_creneaux_par_les_utilisateurs_grand_public'

const props = defineProps({params: { type: Object, required: false }})
const idFitArena = computed(() => useRoute().params.id)
const profils = ref([])
const afficherModale = ref(false)
const modal_title = ref('')

const parametres = computed(() => {

  return props.params
})


// const parametres = computed(() => props.params)

onMounted(async () => {

  // parametres.value = await getParametresById(13)
  profils.value = await getProfils()
})

const modificationStatus = async (parametre) => {

  try {
    if (null === parametre) {

      const id = getParameterByCode(
        PARAM_NB_JOURS_VISIBLES
      ).valeur

      await postParametreFitArena({
        actif: parametre.actif,
        parametre: '/api/parametres/'
      }, parametre.id)
    } else {
      parametre.actif = !parametre.actif
    }
    await patchParametreFitArena({ actif: parametre.actif }, parametre.id)

    toast.success('Modification du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}
</script>

<template>
  <Card>
    <h1>Condition de visualisation des créneaux</h1>
    {{ visualisation_creneaux }}
    <div class="flex items-center space-x-2">
      <Button icon="edit" couleur="secondary" borderless></Button>
      <div class="flex items-center">
        <div class="mr-2">Actif</div>
        <Switch :modelValue="
        props.params?.[PARAM_NB_JOURS_VISIBLES]?.actif ?? false"
                @change="modificationStatus(props.params[PARAM_NB_JOURS_VISIBLES] ?? null)"/>
      </div>
      <div class="text-sm">
        Nombre de jours visibles pour la réservation de créneaux par les
        utilisateurs Grand Public
      </div>
      <Button label="Détails" couleur="secondary" />
    </div>

{{ parametres }}
    <Button
      class="font-bold font-black"
      label="Ajouter une condition de visualisation des créneaux"
      icon="add"
      couleur="secondary"
    />
    <Modal v-if="afficherModale"> </Modal>
  </Card>
</template>

<style scoped lang="scss">

</style>