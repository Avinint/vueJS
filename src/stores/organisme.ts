import { getOrganismesSelect } from "@api/organisme";
import { defineStore } from "pinia";

type OrganismeStoreState = {
    organismes: Organisme[],
    organisme?: Organisme,
}

export const useOrganismeStore = defineStore('organisme', {
    state: (): OrganismeStoreState => ({
        organismes: [],
        organisme: undefined,
    }),
    getters: {
        getOrganismes: (state) => state.organismes,
        getOrganisme: (state) => state.organisme,
    },
    actions: {
    async fetchOrganismes(query =  {}) {
            getOrganismesSelect(query).then(data => {
                this.organismes = data;
            });
        },
    }
});
